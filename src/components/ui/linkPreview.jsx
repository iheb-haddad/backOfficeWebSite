import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

const LinkPreview = ({ url }) => {
  const [isOpen, setIsOpen] = useState(false);

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
        <span>Preview</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Link Preview</DialogTitle>
          </DialogHeader>
          <iframe
            src={url}
            title="Link Preview"
            className="w-full h-96 border rounded"
            loading="lazy"
          ></iframe>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LinkPreview;