import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

const LinkPreview = ({ url }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("Impossible de charger le contenu");

  // useEffect(() => {
  //   const fetchIframelyData = async () => {
  //     if (!url) return;
  //     try {
  //       const response = await fetch(
  //         `https://iframe.ly/api/iframely?url=${encodeURIComponent(url)}&api_key=${import.meta.env.VITE_IFRAMELY_API_KEY}`
  //       );
  //       const data = await response.json();
  //       setLoading(false);
  //       if (data.html) {
  //         setHtmlContent(data.html);
  //       } else {
  //         console.error(data.status === 403);
  //         if(data.status === 403) {
  //           setError("Ce site necessite une authentification pour afficher le contenu");
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error fetching Iframely data:", error);
  //     }
  //   };

  //   // if (isOpen) {
  //     fetchIframelyData();
  //   // }
  // }, [url]);

  return (
    <div className="inline-block">
      <Button
        variant="ghost"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(true);
        }}
        className="flex items-center space-x-2 text-blue-600"
      >
        <Eye className="w-4 h-4" />
        <span>Aperçu</span>
      </Button>
      <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          document.body.style.pointerEvents = 'auto';
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Link Preview</DialogTitle>
          </DialogHeader>
          {/* {htmlContent ? ( */}
            <iframe
            src={url}
            title="Link Preview"
            className="w-full h-96"
            frameBorder="0"
            allowFullScreen
            />
          {/* // ) : loading ? (
          //   <p className="text-center text-lg my-6 text-gray-500">Chargement du contenu...</p>
          // ): (
          //   <p className="text-center text-lg my-6 text-red-500">{error}</p>
          // )} */}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LinkPreview;
