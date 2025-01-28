"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { useToast } from "@/app/_hooks/use-toast";

interface AddUserFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

const AddUserModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AddUserFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "CLIENT",
    },
  });

  const role = watch("role");

  const onSubmit = async (data: AddUserFormValues) => {
    try {
      const response = await fetch("/api/users/createUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao criar usuário.");
      }

      toast({
        title: "Sucesso!",
        description: "Usuário criado com sucesso.",
      });

      reset();
      onClose();
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      toast({
        variant: "destructive",
        title: "Erro ao criar usuário",
        description:
          error instanceof Error
            ? error.message
            : "Erro inesperado. Tente novamente.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Usuário</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Primeiro Nome</label>
            <Input
              {...register("firstName", {
                required: "O primeiro nome é obrigatório.",
              })}
              placeholder="Digite o primeiro nome"
              className="w-full"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Sobrenome</label>
            <Input
              {...register("lastName", {
                required: "O sobrenome é obrigatório.",
              })}
              placeholder="Digite o sobrenome"
              className="w-full"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm">{errors.lastName.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <Input
              type="email"
              {...register("email", { required: "O e-mail é obrigatório." })}
              placeholder="Digite o e-mail"
              className="w-full"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Senha</label>
            <Input
              type="password"
              {...register("password", { required: "A senha é obrigatória." })}
              placeholder="Digite a senha"
              className="w-full"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Tipo de Usuário</label>
            <Select
              value={role}
              onValueChange={(value) => setValue("role", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de usuário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CLIENT">Cliente</SelectItem>
                <SelectItem value="EMPLOYEE">Funcionário</SelectItem>
                <SelectItem value="ADMIN">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit">Salvar</Button>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserModal;
