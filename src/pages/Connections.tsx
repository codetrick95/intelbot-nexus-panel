
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, QrCode, Download } from "lucide-react";
import { useUserSettings } from "@/hooks/useUserSettings";
import QRCode from 'qrcode';

const Connections = () => {
  const { settings, updateSettings, isLoading } = useUserSettings();
  const [qrCodeLink, setQrCodeLink] = useState("");
  const [generatedQRCode, setGeneratedQRCode] = useState<string | null>(null);

  const handleGenerateQR = async () => {
    if (!qrCodeLink.trim()) return;
    
    try {
      const qrCodeDataURL = await QRCode.toDataURL(qrCodeLink);
      setGeneratedQRCode(qrCodeDataURL);
      updateSettings({ qr_code_link: qrCodeLink });
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
    }
  };

  const handleStatusUpdate = (status: string) => {
    updateSettings({ connection_status: status });
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

  const connectionStatus = settings?.connection_status || 'desconectado';
  const isConnected = connectionStatus === 'connected';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Conexões</h1>
        <p className="text-gray-600 mt-2">
          Gerencie suas conexões com WhatsApp
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isConnected ? (
              <Wifi className="h-5 w-5 text-green-500" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-500" />
            )}
            Status da Conexão
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">WhatsApp:</span>
            <Badge variant={isConnected ? "default" : "secondary"}>
              {isConnected ? "Conectado" : "Desconectado"}
            </Badge>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleStatusUpdate('connected')}
              disabled={isConnected}
            >
              Conectar
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleStatusUpdate('disconnected')}
              disabled={!isConnected}
            >
              Desconectar
            </Button>
          </div>
        </CardContent>
      </Card>

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

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Conexões</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <p className="font-medium">Conexão WhatsApp</p>
                <p className="text-sm text-gray-500">
                  {settings?.last_checked ? 
                    `Última verificação: ${new Date(settings.last_checked).toLocaleString()}` :
                    "Nunca verificado"
                  }
                </p>
              </div>
              <Badge variant={isConnected ? "default" : "secondary"}>
                {isConnected ? "Ativo" : "Inativo"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Connections;
