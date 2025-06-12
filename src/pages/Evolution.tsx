
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, CheckCircle, AlertCircle } from "lucide-react";
import { useUserSettings } from "@/hooks/useUserSettings";

const Evolution = () => {
  const { settings, updateSettings, isLoading, isUpdating } = useUserSettings();
  const [evolutionUrl, setEvolutionUrl] = useState("");
  const [evolutionKey, setEvolutionKey] = useState("");

  useEffect(() => {
    if (settings) {
      setEvolutionUrl(settings.evolution_url || "");
      setEvolutionKey(settings.evolution_key || "");
    }
  }, [settings]);

  const handleSaveConfig = () => {
    updateSettings({ 
      evolution_url: evolutionUrl,
      evolution_key: evolutionKey 
    });
  };

  const handleTestConnection = () => {
    // Simular teste de conexão e salvar timestamp
    updateSettings({ 
      last_checked: new Date().toISOString()
    });
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

  const hasConfig = settings?.evolution_url && settings?.evolution_key;
  const lastChecked = settings?.last_checked;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Evolution API</h1>
        <p className="text-gray-600 mt-2">
          Configure sua conexão com a Evolution API
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Status da Configuração
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Evolution API:</span>
            <Badge variant={hasConfig ? "default" : "secondary"}>
              {hasConfig ? "Configurada" : "Não configurada"}
            </Badge>
          </div>
          {lastChecked && (
            <p className="text-sm text-gray-500 mt-2">
              Última verificação: {new Date(lastChecked).toLocaleString()}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configurações da API</CardTitle>
          <CardDescription>
            Configure sua URL e chave da Evolution API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="evolution-url">URL da Evolution API</Label>
            <Input
              id="evolution-url"
              type="url"
              value={evolutionUrl}
              onChange={(e) => setEvolutionUrl(e.target.value)}
              placeholder="https://api.evolution.com"
            />
          </div>

          <div>
            <Label htmlFor="evolution-key">Chave da API</Label>
            <Input
              id="evolution-key"
              type="password"
              value={evolutionKey}
              onChange={(e) => setEvolutionKey(e.target.value)}
              placeholder="Sua chave secreta da API"
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleSaveConfig} 
              disabled={isUpdating || !evolutionUrl || !evolutionKey}
            >
              {isUpdating ? "Salvando..." : "Salvar Configuração"}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleTestConnection}
              disabled={!hasConfig}
            >
              Testar Conexão
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status da Conexão</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {hasConfig ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-green-700">Configuração salva</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  <span className="text-yellow-700">Aguardando configuração</span>
                </>
              )}
            </div>
            
            {hasConfig && (
              <div className="text-sm text-gray-600">
                <p>URL: {settings?.evolution_url}</p>
                <p>Chave: ****{settings?.evolution_key?.slice(-4)}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Evolution;
