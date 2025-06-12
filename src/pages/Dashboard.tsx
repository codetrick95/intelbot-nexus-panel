
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserSettings } from "@/hooks/useUserSettings";

const Dashboard = () => {
  const { settings, updateSettings, isLoading, isUpdating } = useUserSettings();
  const [botPrompt, setBotPrompt] = useState(
    "Você é um assistente inteligente e prestativo. Responda sempre de forma educada e objetiva."
  );

  useEffect(() => {
    if (settings?.bot_prompt) {
      setBotPrompt(settings.bot_prompt);
    }
  }, [settings]);

  const handleSavePrompt = async () => {
    updateSettings({ bot_prompt: botPrompt });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Gerencie seu bot e configurações
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Prompt do Bot</CardTitle>
          <CardDescription>
            Altere o prompt do seu assistente a qualquer momento. 
            Este texto define como seu bot irá se comportar nas conversas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={botPrompt}
            onChange={(e) => setBotPrompt(e.target.value)}
            placeholder="Escreva aqui o prompt do seu bot..."
            className="min-h-[200px]"
          />
          <div className="flex justify-end">
            <Button onClick={handleSavePrompt} disabled={isUpdating}>
              {isUpdating ? "Salvando..." : "Salvar Prompt"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Status Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Bot Status:</span>
                <span className="text-green-600 font-medium">Ativo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Conexões:</span>
                <span className="text-blue-600 font-medium">
                  {settings?.connection_status === 'connected' ? '1 ativa' : '0 ativas'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Evolution API:</span>
                <span className={`font-medium ${settings?.evolution_url ? 'text-green-600' : 'text-gray-400'}`}>
                  {settings?.evolution_url ? 'Configurada' : 'Não configurada'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/connections">
                🔌 Ver Conexões
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/evolution">
                ⚙️ Configurar Evolution API
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" disabled>
              📜 Histórico de Conversas (em breve)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
