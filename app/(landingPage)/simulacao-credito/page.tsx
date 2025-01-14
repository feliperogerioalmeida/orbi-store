"use client";

import { useState, useEffect } from "react";
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
  const [iphones, setIphones] = useState<iPhone[]>([]);
  const [selectedModel, setSelectedModel] = useState<iPhone | null>(null);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [selectedCapacity, setSelectedCapacity] = useState<Capacity | null>(
    null,
  );
  const [batteryHealth, setBatteryHealth] = useState<string | null>(null);
  const [issues, setIssues] = useState<string[]>([]);
  const [estimatedValue, setEstimatedValue] = useState<number | null>(null);

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

  const calculateValue = () => {
    if (!selectedCapacity || !batteryHealth) return;

    const seminovoCondition = selectedCapacity.conditions.find(
      (condition) =>
        condition.conditionType.trim().toLowerCase() ===
        "semi-novo".toLowerCase(),
    );

    if (!seminovoCondition) {
      console.error(
        "Condição seminovo não encontrada para a capacidade selecionada!",
      );
      setEstimatedValue(0); // Define o valor estimado como 0 para evitar erros
      return;
    }

    let baseValue = seminovoCondition.maxUpgradePrice; // Valor inicial para seminovo

    console.log("Valor base da condição seminovo:", baseValue);

    // Penalizações baseadas na saúde da bateria
    if (batteryHealth === "<80%") baseValue -= 500;
    if (batteryHealth === "80%-85%") baseValue -= 300;
    if (batteryHealth === ">85%") baseValue -= 200;

    // Penalizações baseadas nos problemas informados
    if (issues.includes("Tela Trocada")) baseValue -= 300;
    if (issues.includes("Face ID Defeituoso")) baseValue -= 800;
    if (issues.includes("Vidro Traseiro Quebrado")) baseValue -= 400;
    if (issues.includes("Flash Não Funciona")) baseValue -= 300;
    if (issues.includes("Bateria Trocada")) baseValue -= 200;

    setEstimatedValue(baseValue > 0 ? baseValue : 0); // Garantir que o valor final não seja negativo
  };

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

    const whatsappUrl = `https://wa.me/${ORBI_CONSTANTS.CONTACT.WHATSAPP}?text=${encodeURIComponent(
      message,
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="pt-[120px] text-white px-4 h-full w-full min-h-screen flex flex-col gap-8 bg-custom-bg-2">
      <h1 className="text-3xl font-bold text-center">Simulação de Crédito</h1>

      {/* Imagem Principal */}
      {selectedModel && selectedColor && (
        <div className="flex justify-center">
          <Image
            src={selectedColor.imageUrl}
            alt={`${selectedModel.model} - ${selectedColor.name}`}
            width={150}
            height={150}
            className="object-cover rounded-lg"
          />
        </div>
      )}

      {/* Simulação de Escolha */}
      {estimatedValue === null ? (
        <>
          {/* Seleção do Modelo */}
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

          {/* Seleção da Cor */}
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

          {/* Seleção da Capacidade */}
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

          {/* Checklist de Problemas */}
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

          {/* Saúde da Bateria */}
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

          {/* Botão de Calcular */}
          {batteryHealth && (
            <Button size="lg" variant="secondary" onClick={calculateValue}>
              Calcular Valor
            </Button>
          )}
        </>
      ) : (
        // Resumo da Simulação
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

      {/* Link para Voltar */}
      <Button asChild className="text-blue-500" variant="link">
        <Link href="/" passHref>
          Voltar para o Início
        </Link>
      </Button>
    </div>
  );
};

export default CreditSimulator;
