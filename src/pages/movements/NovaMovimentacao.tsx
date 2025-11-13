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
  const [selectedLote, setSelectedLote] = useState<Batch | null>(null);
  const [formData, setFormData] = useState({
    lote_id: "",
    tipo: "",
    quantidade: "",
    data: "",
    observacoes: "",
  });

  const tiposMovimentacao = [
    "Produção",
    "Transporte",
    "Armazenamento",
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
    
    // Validar quantidade antes de enviar
    const quantidadeMovimentada = parseFloat(formData.quantidade);
    
    if (!selectedLote) {
      toast.error("Selecione um lote antes de continuar");
      return;
    }
    
    if (isNaN(quantidadeMovimentada) || quantidadeMovimentada <= 0) {
      toast.error("A quantidade deve ser maior que zero");
      return;
    }
    
    const producaoDisponivel = selectedLote.producao ? Number(selectedLote.producao) : 0;
    
    if (quantidadeMovimentada > producaoDisponivel) {
      toast.error(
        `A quantidade movimentada (${quantidadeMovimentada.toFixed(2)} ${selectedLote.unidadeMedida || 'kg'}) não pode ser maior que a produção disponível (${producaoDisponivel.toFixed(2)} ${selectedLote.unidadeMedida || 'kg'})`
      );
      return;
    }
    
    setLoading(true);

    try {
      const movementData: MovementCreate = {
        batch_id: parseInt(formData.lote_id),
        tipo_movimentacao: formData.tipo,
        quantidade: quantidadeMovimentada,
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
                  onValueChange={(value) => {
                    const lote = lotes.find(l => l.id.toString() === value);
                    setSelectedLote(lote || null);
                    setFormData({ ...formData, lote_id: value });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um lote" />
                  </SelectTrigger>
                  <SelectContent>
                    {lotes.map((lote) => (
                      <SelectItem key={lote.id} value={lote.id.toString()}>
                        {lote.code} - {Number(lote.producao || 0).toFixed(2)} {lote.unidadeMedida || 'kg'} disponível
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedLote && (
                  <p className="text-sm text-muted-foreground">
                    Produção disponível: <span className="font-semibold text-foreground">
                      {Number(selectedLote.producao || 0).toFixed(2)} {selectedLote.unidadeMedida || 'kg'}
                    </span>
                  </p>
                )}
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
                <Label htmlFor="quantidade">
                  Quantidade ({selectedLote?.unidadeMedida || 'kg'}) *
                </Label>
                <Input
                  id="quantidade"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={selectedLote?.producao ? Number(selectedLote.producao) : undefined}
                  placeholder={selectedLote ? `Máximo: ${Number(selectedLote.producao || 0).toFixed(2)}` : "Ex: 1000"}
                  value={formData.quantidade}
                  onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                  required
                  disabled={!selectedLote}
                />
                {formData.quantidade && selectedLote && parseFloat(formData.quantidade) > Number(selectedLote.producao || 0) && (
                  <p className="text-sm text-red-500">
                    ⚠️ A quantidade não pode ser maior que {Number(selectedLote.producao || 0).toFixed(2)} {selectedLote.unidadeMedida || 'kg'}
                  </p>
                )}
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
