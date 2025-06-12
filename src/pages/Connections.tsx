
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, QrCode, Download, Plus } from "lucide-react";
import { useWhatsAppInstances } from "@/hooks/useWhatsAppInstances";
import { useActivityLogs } from "@/hooks/useActivityLogs";
import QRCode from 'qrcode';

const Connections = () => {
  const { instances, isLoading, createInstance, updateInstance } = useWhatsAppInstances();
  const { logActivity } = useActivityLogs();
  const [qrCodeLink, setQrCodeLink] = useState("");
  const [generatedQRCode, setGeneratedQRCode] = useState<string | null>(null);
  const [instanceName, setInstanceName] = useState("");

  const handleGenerateQR = async () => {
    if (!qrCodeLink.trim()) return;
    
    try {
      const qrCodeDataURL = await QRCode.toDataURL(qrCodeLink);
      setGeneratedQRCode(qrCodeDataURL);
      
      logActivity({
        action: "QR_CODE_GENERATED",
        description: "QR Code gerado para conexão WhatsApp",
        metadata: { url: qrCodeLink }
      });
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
    }
  };

  const handleCreateInstance = () => {
    if (!instanceName.trim()) return;
    
    createInstance({
      instance_name: instanceName,
      status: 'disconnected'
    });
    
    setInstanceName("");
    
    logActivity({
      action: "INSTANCE_CREATED",
      description: `Nova instância criada: ${instanceName}`
    });
  };

  const handleStatusUpdate = (instanceId: string, status: string) => {
    updateInstance({ 
      id: instanceId, 
      status 
    });
    
    logActivity({
      action: "INSTANCE_STATUS_CHANGED",
      description: `Status da instância alterado para: ${status}`,
      metadata: { instanceId, newStatus: status }
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Conexões</h1>
        <p className="text-gray-600 mt-2">
          Gerencie suas instâncias e conexões com WhatsApp
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Nova Instância
          </CardTitle>
          <CardDescription>
            Crie uma nova instância do WhatsApp
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="instance-name">Nome da Instância</Label>
            <Input
              id="instance-name"
              value={instanceName}
              onChange={(e) => setInstanceName(e.target.value)}
              placeholder="Ex: WhatsApp Principal"
            />
          </div>
          <Button onClick={handleCreateInstance} disabled={!instanceName.trim()}>
            Criar Instância
          </Button>
        </CardContent>
      </Card>

      {instances && instances.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Suas Instâncias</h2>
          {instances.map((instance) => (
            <Card key={instance.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {instance.status === 'connected' ? (
                    <Wifi className="h-5 w-5 text-green-500" />
                  ) : (
                    <WifiOff className="h-5 w-5 text-red-500" />
                  )}
                  {instance.instance_name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge variant={instance.status === 'connected' ? "default" : "secondary"}>
                    {instance.status === 'connected' ? "Conectado" : "Desconectado"}
                  </Badge>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleStatusUpdate(instance.id, 'connected')}
                    disabled={instance.status === 'connected'}
                  >
                    Conectar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleStatusUpdate(instance.id, 'disconnected')}
                    disabled={instance.status === 'disconnected'}
                  >
                    Desconectar
                  </Button>
                </div>

                <p className="text-sm text-gray-500">
                  Criado em: {new Date(instance.created_at).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Gerar QR Code
          </CardTitle>
          <CardDescription>
            Cole o link da sua instância para gerar o QR Code de conexão
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="qr-link">Link da Instância</Label>
            <Input
              id="qr-link"
              type="url"
              value={qrCodeLink}
              onChange={(e) => setQrCodeLink(e.target.value)}
              placeholder="https://minha.instancia.com"
            />
          </div>
          
          <Button onClick={handleGenerateQR} disabled={!qrCodeLink.trim()}>
            Gerar QR Code
          </Button>

          {generatedQRCode && (
            <div className="text-center">
              <img 
                src={generatedQRCode} 
                alt="QR Code" 
                className="mx-auto border rounded-lg p-4 bg-white"
              />
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = generatedQRCode;
                  link.download = 'qrcode.png';
                  link.click();
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Baixar QR Code
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Connections;
