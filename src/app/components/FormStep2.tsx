import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { Upload, FileText, X, Loader2, ArrowLeft } from "lucide-react";

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  resume: File | null;
  coverLetter: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  resume?: string;
  coverLetter?: string;
}

interface FormStep2Props {
  formData: FormData;
  errors: FormErrors;
  isSubmitting: boolean;
  onInputChange: (name: keyof FormData, value: string | File | null) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: () => void;
  onSubmit: () => void;
  onBack: () => void;
}

export const FormStep2 = ({ 
  formData, 
  errors, 
  isSubmitting, 
  onInputChange, 
  onFileUpload, 
  onRemoveFile, 
  onSubmit, 
  onBack 
}: FormStep2Props) => {
  const wordCount = formData.coverLetter.trim().split(/\s+/).filter(word => word.length > 0).length;
  const maxWords = 500;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-primary text-white flex items-center justify-center text-sm font-semibold">
              ✓
            </div>
            <div className="w-12 h-0.5 bg-gradient-primary"></div>
            <div className="w-8 h-8 rounded-full bg-gradient-primary text-white flex items-center justify-center text-sm font-semibold">
              2
            </div>
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">Supporting Documents</h3>
        <p className="text-muted-foreground">Upload your resume and tell us about yourself</p>
      </div>

      {/* Resume Upload */}
      <div className="space-y-2">
        <Label htmlFor="resume">Resume *</Label>
        <div className="space-y-3">
          {!formData.resume ? (
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Upload your resume (PDF or DOCX, max 10MB)
              </p>
              <Input
                id="resume"
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={onFileUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("resume")?.click()}
              >
                Choose File
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">{formData.resume.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(formData.resume.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onRemoveFile}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
          {errors.resume && (
            <p className="text-sm text-destructive">{errors.resume}</p>
          )}
        </div>
      </div>

      {/* Cover Letter */}
      <div className="space-y-2">
        <Label htmlFor="coverLetter">
          Cover Letter{" "}
          <span className="text-sm text-muted-foreground font-normal">
            (optional but recommended)
          </span>
        </Label>
        <Textarea
          id="coverLetter"
          placeholder="Tell us why you're interested in this position and what makes you a great fit..."
          className="min-h-[120px] resize-none"
          value={formData.coverLetter}
          onChange={(e) => onInputChange("coverLetter", e.target.value)}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>300-500 words recommended</span>
          <span className={wordCount > maxWords ? "text-destructive" : ""}>
            {wordCount}/{maxWords} words
          </span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1 h-12"
          disabled={isSubmitting}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          type="button"
          onClick={onSubmit}
          className="flex-1 bg-gradient-primary hover:opacity-90 transition-opacity h-12 text-lg font-semibold"
          disabled={isSubmitting || !formData.resume}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            "Apply Now"
          )}
        </Button>
      </div>
    </div>
  );
};