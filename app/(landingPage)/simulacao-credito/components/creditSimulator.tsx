"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/app/_components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { Checkbox } from "@/app/_components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/app/_components/ui/radio-group";
import ORBI_CONSTANTS from "@/app/constants/constants";
import { useSession } from "next-auth/react";
import { useToast } from "@/app/_hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { ToastAction } from "@/app/_components/ui/toast";

type Color = {
  name: string;
  imageUrl: string;
};

type Condition = {
  conditionType: string;
  maxUpgradePrice: number;
};

type Capacity = {
  size: string;
  conditions: Condition[];
};

type iPhone = {
  id: string;
  model: string;
  colors: Color[];
  capacities: Capacity[];
};

const CreditSimulator = () => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [iphones, setIphones] = useState<iPhone[]>([]);
  const [selectedModel, setSelectedModel] = useState<iPhone | null>(null);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [selectedCapacity, setSelectedCapacity] = useState<Capacity | null>(
    null,
  );
  const [batteryHealth, setBatteryHealth] = useState<string | null>(null);
  const [issues, setIssues] = useState<string[]>([]);
  const [estimatedValue, setEstimatedValue] = useState<number | null>(null);
  const [simulationId, setSimulationId] = useState<string | null>(null);
  const [isDirectSave, setIsDirectSave] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const urlSimulationId = searchParams.get("simulationId");
    if (urlSimulationId) {
      setSimulationId(urlSimulationId);
      setIsDirectSave(false);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchIphones = async () => {
      const response = await fetch("/api/iphones");
      const data = await response.json();
      setIphones(data.iphones);
    };

    fetchIphones();
  }, []);

  const handleToggleIssue = (issue: string) => {
    setIssues((prev) =>
      prev.includes(issue) ? prev.filter((i) => i !== issue) : [...prev, issue],
    );
  };

  const calculateValue = async () => {
    if (!selectedCapacity || !batteryHealth) {
      toast({
        title: "Erro",
        description:
          "Selecione todos os campos obrigatórios antes de calcular.",
        variant: "destructive",
      });
      return;
    }

    const seminovoCondition = selectedCapacity.conditions.find(
      (condition) =>
        condition.conditionType.trim().toLowerCase() ===
        "seminovo".toLowerCase(),
    );

    if (!seminovoCondition) {
      toast({
        title: "Erro",
        description:
          "Condição seminovo não encontrada para a capacidade selecionada.",
        variant: "destructive",
      });
      setEstimatedValue(0);
      return;
    }

    let baseValue = seminovoCondition.maxUpgradePrice;

    if (batteryHealth === "<80%") baseValue -= 500;
    if (batteryHealth === "80%-85%") baseValue -= 300;
    if (batteryHealth === ">85%") baseValue -= 200;

    if (issues.includes("Tela Trocada")) baseValue -= 300;
    if (issues.includes("Face ID Defeituoso")) baseValue -= 800;
    if (issues.includes("Vidro Traseiro Quebrado")) baseValue -= 400;
    if (issues.includes("Flash Não Funciona")) baseValue -= 300;
    if (issues.includes("Bateria Trocada")) baseValue -= 200;

    const calculatedValue = baseValue > 0 ? baseValue : 0;
    setEstimatedValue(calculatedValue);

    await saveSimulation(calculatedValue);
  };

  const saveSimulation = async (calculatedValue: number) => {
    if (
      !selectedModel ||
      !selectedColor ||
      !selectedCapacity ||
      !batteryHealth
    ) {
      toast({
        title: "Erro ao salvar simulação",
        description: "Todos os campos obrigatórios devem ser preenchidos.",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      userId: session?.user?.id || null,
      model: selectedModel?.model,
      color: selectedColor?.name,
      capacity: selectedCapacity?.size,
      batteryHealth,
      issues: issues.length > 0 ? issues : [],
      estimatedValue: calculatedValue,
    };

    try {
      const response = await fetch("/api/simulations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro recebido da API:", errorData);
        throw new Error(errorData.error || "Erro ao salvar simulação.");
      }

      const data = await response.json();

      setSimulationId(data.id);

      if (!session) {
        toast({
          title: "Simulação salva como visitante!",
          description: "Faça login para vincular esta simulação à sua conta.",
          action: (
            <ToastAction altText="Fazer Login">
              <Button
                variant="ghost"
                onClick={() => {
                  router.push(
                    `/login?callbackUrl=/simulacao-credito?simulationId=${data.id}`,
                  );
                }}
              >
                Fazer Login
              </Button>
            </ToastAction>
          ),
        });
      } else {
        setIsDirectSave(true);
        toast({
          title: "Sucesso!",
          description: "Sua simulação foi salva com sucesso.",
        });
      }
    } catch (error) {
      console.error("Erro ao salvar simulação:", error);
      toast({
        title: "Erro ao salvar simulação",
        description: "Ocorreu um erro ao salvar a simulação. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const linkSimulation = useCallback(async () => {
    if (!simulationId || !session?.user?.id || isDirectSave) return;

    try {
      const response = await fetch(`/api/simulations/${simulationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id }),
      });

      if (!response.ok) {
        throw new Error("Erro ao vincular simulação.");
      }

      toast({
        title: "Simulação vinculada com sucesso!",
        description: "Sua simulação agora está associada à sua conta.",
      });

      const params = new URLSearchParams(window.location.search);
      params.delete("simulationId");
      window.history.replaceState(null, "", "?" + params.toString());
    } catch (error) {
      console.error("Erro ao vincular simulação:", error);
      toast({
        title: "Erro ao vincular simulação",
        description: "Não foi possível vincular a simulação. Tente novamente.",
        variant: "destructive",
      });
    }
  }, [simulationId, session?.user?.id, isDirectSave, toast]);

  useEffect(() => {
    if (session?.user?.id && simulationId) {
      linkSimulation();
    }
  }, [session?.user?.id, simulationId, linkSimulation]);

  const resetSimulation = () => {
    setSelectedModel(null);
    setSelectedColor(null);
    setSelectedCapacity(null);
    setBatteryHealth(null);
    setIssues([]);
    setEstimatedValue(null);
  };

  const sendToWhatsApp = () => {
    const message = `Olá! Gostaria de continuar com a simulação de crédito do meu iPhone.\n
Modelo: ${selectedModel?.model}\n
Cor: ${selectedColor?.name}\n
Capacidade: ${selectedCapacity?.size}\n
Saúde da Bateria: ${batteryHealth}\n
Problemas: ${issues.join(", ")}\n
Valor Estimado: R$ ${estimatedValue}`;

    const whatsappUrl = `${ORBI_CONSTANTS.LINKS.WHATSAPP_URL}?text=${encodeURIComponent(
      message,
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="pt-[120px] text-white px-4 h-full w-full min-h-screen flex flex-col gap-8 bg-custom-bg-2 bg-fill bg-center bg-no-repeat bg-cover">
      <h1 className="text-3xl font-bold text-center">Simulação de Crédito</h1>

      {selectedModel && selectedColor ? (
        <div className="flex justify-center">
          <Image
            src={selectedColor.imageUrl}
            alt={`${selectedModel.model} - ${selectedColor.name}`}
            width={150}
            height={150}
            className="object-cover rounded-lg lg:h-[300px] lg:w-[250px] lg:object-fill "
          />
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="w-[150px] h-[px205] lg:h-[300px] "></div>
        </div>
      )}

      {estimatedValue === null ? (
        <>
          <div>
            <h2 className="text-lg font-bold mb-2">1. Escolha o Modelo</h2>
            <Select
              onValueChange={(value) => {
                const model = iphones.find((iphone) => iphone.model === value);
                setSelectedModel(model || null);
                setSelectedColor(null);
                setSelectedCapacity(null);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o modelo" />
              </SelectTrigger>
              <SelectContent>
                {iphones.map((iphone) => (
                  <SelectItem key={iphone.id} value={iphone.model}>
                    {iphone.model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedModel && (
            <div>
              <h2 className="text-lg font-bold mb-2">2. Escolha a Cor</h2>
              <div className="flex gap-4 flex-wrap w-full justify-start items-center">
                {selectedModel.colors.map((color) => (
                  <Button
                    key={color.name}
                    variant={
                      selectedColor?.name === color.name ? "black" : "outline"
                    }
                    onClick={() => setSelectedColor(color)}
                    className="text-white"
                  >
                    <p className="text-xs">{color.name}</p>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {selectedColor && (
            <div>
              <h2 className="text-lg font-bold mb-2">
                3. Escolha a Capacidade
              </h2>
              <div className="flex gap-4">
                {selectedModel?.capacities.map((capacity) => (
                  <Button
                    key={capacity.size}
                    variant={
                      selectedCapacity?.size === capacity.size
                        ? "black"
                        : "outline"
                    }
                    onClick={() => setSelectedCapacity(capacity)}
                    className="text-white"
                  >
                    <p className="text-xs">{capacity.size}</p>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {selectedCapacity && (
            <div>
              <h2 className="text-lg font-bold mb-2">
                4. Possui algum desses problemas?
              </h2>
              <div className="flex flex-col gap-2">
                {[
                  "Tela Trocada",
                  "Face ID Defeituoso",
                  "Vidro Traseiro Quebrado",
                  "Flash Não Funciona",
                  "Bateria Trocada",
                ].map((issue) => (
                  <label key={issue} className="flex items-center gap-2">
                    <Checkbox
                      checked={issues.includes(issue)}
                      onCheckedChange={() => handleToggleIssue(issue)}
                    />
                    <span>{issue}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {selectedCapacity && (
            <div>
              <h2 className="text-lg font-bold mb-2">5. Saúde da Bateria</h2>
              <RadioGroup
                onValueChange={(value) => setBatteryHealth(value)}
                className="flex flex-col gap-4"
              >
                <label className="flex items-center gap-2">
                  <RadioGroupItem value="<80%" />
                  <span>Abaixo de 80%</span>
                </label>
                <label className="flex items-center gap-2">
                  <RadioGroupItem value="80%-85%" />
                  <span>Entre 80% e 85%</span>
                </label>
                <label className="flex items-center gap-2">
                  <RadioGroupItem value=">85%" />
                  <span>Acima de 85%</span>
                </label>
              </RadioGroup>
            </div>
          )}

          {batteryHealth && (
            <Button size="lg" variant="secondary" onClick={calculateValue}>
              Calcular Valor
            </Button>
          )}
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-xl font-bold">Resumo da Simulação</h2>
          <p>Modelo: {selectedModel?.model}</p>
          <p>Cor: {selectedColor?.name}</p>
          <p>Capacidade: {selectedCapacity?.size}</p>
          <p>Saúde da Bateria: {batteryHealth}</p>
          <p>Problemas: {issues.length > 0 ? issues.join(", ") : "Nenhum"}</p>
          <h3 className="text-2xl font-bold mt-4">
            Valor Estimado: R$ {estimatedValue}
          </h3>
          <div className="flex justify-center gap-4 mt-4">
            <Button onClick={sendToWhatsApp}>Enviar para o WhatsApp</Button>
            <Button variant="outline" onClick={resetSimulation}>
              Refazer Simulação
            </Button>
          </div>
        </div>
      )}

      <Button asChild className="text-blue-500" variant="link">
        <Link href="/" passHref>
          Voltar para o Início
        </Link>
      </Button>
    </div>
  );
};

export default CreditSimulator;
