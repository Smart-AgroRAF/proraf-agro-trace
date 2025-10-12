import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { createMovement } from "@/api/movements";
import { listBatches } from "@/api/batches";
import type { MovementCreate, Batch } from "@/api/types";

const NovaMovimentacao = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [lotes, setLotes] = useState<Batch[]>([]);
  const [formData, setFormData] = useState({
    lote_id: "",
    tipo: "",
    quantidade: "",
    data: "",
    observacoes: "",
  });

  const tiposMovimentacao = [
    "Plantio",
    "Tratamento",
    "Irrigação",
    "Colheita",
    "Expedição",
  ];

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const data = await listBatches();
        setLotes(data);
      } catch (error: any) {
        toast.error("Erro ao carregar lotes");
      }
    };

    fetchBatches();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const movementData: MovementCreate = {
        batch_id: parseInt(formData.lote_id),
        tipo_movimentacao: formData.tipo,
        quantidade: parseFloat(formData.quantidade),
      };

      await createMovement(movementData);
      toast.success("Movimentação registrada com sucesso!");
      navigate("/movimentacoes");
    } catch (error: any) {
      toast.error(error.message || "Erro ao registrar movimentação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/movimentacoes")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <Card className="max-w-2xl mx-auto shadow-soft">
          <CardHeader>
            <CardTitle className="text-2xl">Registrar Nova Movimentação</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="lote">Lote *</Label>
                <Select
                  value={formData.lote_id}
                  onValueChange={(value) => setFormData({ ...formData, lote_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um lote" />
                  </SelectTrigger>
                  <SelectContent>
                    {lotes.map((lote) => (
                      <SelectItem key={lote.id} value={lote.id.toString()}>
                        {lote.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Movimentação *</Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value) => setFormData({ ...formData, tipo: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposMovimentacao.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantidade">Quantidade (kg) *</Label>
                <Input
                  id="quantidade"
                  type="number"
                  placeholder="Ex: 1000"
                  value={formData.quantidade}
                  onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data">Data *</Label>
                <Input
                  id="data"
                  type="date"
                  value={formData.data}
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  placeholder="Observações sobre a movimentação..."
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? "Registrando..." : "Registrar Movimentação"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/movimentacoes")}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NovaMovimentacao;
