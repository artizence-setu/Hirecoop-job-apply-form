import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";

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

interface FormStep1Props {
  formData: FormData;
  errors: FormErrors;
  onInputChange: (name: keyof FormData, value: string | File | null) => void;
  onNext: () => void;
}

export const FormStep1 = ({ formData, errors, onInputChange, onNext }: FormStep1Props) => {
  const handleNext = () => {
    // Validate step 1 fields only
    const step1HasErrors = errors.fullName || errors.email || errors.phoneNumber;
    const step1HasEmptyFields = !formData.fullName.trim() || !formData.email.trim() || !formData.phoneNumber.trim();
    
    if (!step1HasErrors && !step1HasEmptyFields) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-primary text-white flex items-center justify-center text-sm font-semibold">
              1
            </div>
            <div className="w-12 h-0.5 bg-muted"></div>
            <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-semibold">
              2
            </div>
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
        <p className="text-muted-foreground">Lets start with your basic details</p>
      </div>

      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name *</Label>
        <Input
          id="fullName"
          placeholder="e.g., John Smith"
          value={formData.fullName}
          onChange={(e) => onInputChange("fullName", e.target.value)}
          className={errors.fullName ? "border-destructive" : ""}
        />
        {errors.fullName && (
          <p className="text-sm text-destructive">{errors.fullName}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          type="email"
          placeholder="e.g., john.smith@email.com"
          value={formData.email}
          onChange={(e) => onInputChange("email", e.target.value)}
          className={errors.email ? "border-destructive" : ""}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email}</p>
        )}
      </div>

      {/* Phone Number */}
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number *</Label>
        <Input
          id="phoneNumber"
          placeholder="e.g., +1 (555) 123-4567"
          value={formData.phoneNumber}
          onChange={(e) => onInputChange("phoneNumber", e.target.value)}
          className={errors.phoneNumber ? "border-destructive" : ""}
        />
        {errors.phoneNumber && (
          <p className="text-sm text-destructive">{errors.phoneNumber}</p>
        )}
      </div>

      <Button
        type="button"
        onClick={handleNext}
        className="w-full bg-gradient-primary hover:opacity-90 transition-opacity h-12 text-lg font-semibold"
        disabled={!formData.fullName.trim() || !formData.email.trim() || !formData.phoneNumber.trim() || !!errors.fullName || !!errors.email || !!errors.phoneNumber}
      >
        Continue to Documents
      </Button>
    </div>
  );
};