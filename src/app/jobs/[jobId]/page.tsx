"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FormStep1 } from "@/app/components/FormStep1";
import { FormStep2 } from "@/app/components/FormStep2";
import { toast as sonnerToast } from "sonner";

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

interface JobDetails {
  job_id: string;
  job_title: string;
  job_type: string;
  work_mode: string;
  department: string;
  location: string;
  salary: {
    min: number;
    max: number;
    currency: string;
    type: string;
  };
  no_of_openings: number;
  job_description: string;
  required_skills: string[];
  preferred_skills: string[];
  experience_level: string;
  interview_process: string;
  application_deadline: string;
  status: string;
  hiring_manager: {
    id: string;
    email: string;
    name: string;
  };
  created_at: string;
}

export default function CandidateForm() {

  // getting id form the params
  const { jobId } = useParams<{ jobId: string }>(); 
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    resume: null,
    coverLetter: "",
  });

  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();



// fetching the particular jobs
  useEffect(() => {
    if (!jobId) return;
    const fetchJobDetails = async () => {
      try {
        const res = await fetch(`/api/jobs/${jobId}`);
        const data = await res.json();
        if (data.success) setJobDetails(data.data);
      } catch (error) {
        console.error("Error fetching job details:", error);
        toast({
          title: "Failed to load job details",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    };
    fetchJobDetails();
  }, [jobId, toast]);


  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhoneNumber = (phone: string) =>
    /^\+?[\d\s\-\(\)]{10,}$/.test(phone);

  const validateField = (
    name: string,
    value: string | File | null
  ): string | undefined => {
    switch (name) {
      case "fullName":
        return !value || (typeof value === "string" && value.trim().length < 2)
          ? "Full name must be at least 2 characters"
          : undefined;
      case "email":
        if (!value || typeof value !== "string") return "Email is required";
        return !validateEmail(value)
          ? "Please enter a valid email address"
          : undefined;
      case "phoneNumber":
        if (!value || typeof value !== "string")
          return "Phone number is required";
        return !validatePhoneNumber(value)
          ? "Please enter a valid phone number with country code"
          : undefined;
      case "resume":
        if (!value) return "Resume is required";
        if (value instanceof File) {
          if (value.size > 10 * 1024 * 1024)
            return "File size must be less than 10MB";
          const allowedTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/msword",
          ];
          return !allowedTypes.includes(value.type)
            ? "Only PDF and DOCX files are allowed"
            : undefined;
        }
        return undefined;
      default:
        return undefined;
    }
  };


  const handleInputChange = (
    name: keyof FormData,
    value: string | File | null
  ) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleInputChange("resume", file);
  };

  const removeFile = () => handleInputChange("resume", null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    newErrors.fullName = validateField("fullName", formData.fullName);
    newErrors.email = validateField("email", formData.email);
    newErrors.phoneNumber = validateField("phoneNumber", formData.phoneNumber);
    newErrors.resume = validateField("resume", formData.resume);
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

 
  
  const safeParse = async (res: Response) => {
    try {
      return await res.json();
    } catch {
      return await res.text();
    }
  };

  // submit the response
  const handleSubmit = async () => {
    if (!jobId) return; 
    if (!validateForm()) {
      sonnerToast.error("Validation Error", {
        description: "Please fix the errors before submitting.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      let resumeUrl: string | null = null;

      if (formData.resume) {
        const fileData = new FormData();
        fileData.append("file", formData.resume);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: fileData,
        });

        const uploadData = await safeParse(res);

        if (!res.ok) {
          throw new Error(
            typeof uploadData === "string"
              ? uploadData
              : uploadData.error || "Upload failed"
          );
        }

        resumeUrl = (uploadData as any).url;
      }

      const payload = {
        full_name: formData.fullName,
        email: formData.email,
        phone_number: formData.phoneNumber,
        resume: resumeUrl,
        cover_letter: formData.coverLetter,
      };

      const applyRes = await fetch(
        `https://testdns.artizence.com/api/v1/applications/public/${jobId}/apply`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const applyData = await safeParse(applyRes);

      if (!applyRes.ok) {
        throw new Error(
          typeof applyData === "string"
            ? applyData
            : applyData.detail || "Application failed"
        );
      }

      setIsSubmitted(true);
      sonnerToast.success("Application Submitted 🎉", {
        description: "Thank you for applying! Our team will contact you soon.",
      });
    } catch (error: any) {
      console.error("Error submitting:", error.message || error);
      sonnerToast.error("Submission Failed", {
        description: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => setCurrentStep(2);
  const handleBack = () => setCurrentStep(1);


  //  UI
  
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 p-4">
        <Card className="w-full max-w-md text-center shadow-brand">
          <CardContent className="pt-12 pb-8">
            <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Application Submitted 🎉
            </h2>
            <p className="text-muted-foreground mb-6">
              Thank you for applying! Our team will review your application and
              contact you soon.
            </p>
            <Button
              onClick={() => setIsSubmitted(false)}
              variant="outline"
              className="w-full"
            >
              Submit Another Application
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-4">
      <div className="max-w-2xl mx-auto py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <img
            src="/lovable-uploads/04207b4c-5ef3-44db-b0a4-8d182b51e87b.png"
            alt="Artizence"
            className="h-12 mx-auto mb-6"
          />
          <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Join Our Team
          </h1>
          <p className="text-xl text-muted-foreground">
            We&apos;re looking for talented individuals to help shape the future
          </p>
        </div>

        {/* Job Details */}
        {jobDetails && (
          <Card className="shadow-soft mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-3xl mb-2">
                    {jobDetails.job_title}
                  </CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>{jobDetails.job_type}</span>
                    <span>•</span>
                    <span>
                      {jobDetails.work_mode} / {jobDetails.location}
                    </span>
                    <span>•</span>
                    <span>
                      {jobDetails.salary.currency} {jobDetails.salary.min} -{" "}
                      {jobDetails.salary.max}
                    </span>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <div className="bg-gradient-primary text-white px-4 py-2 rounded-lg text-sm font-medium">
                    Now Hiring
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">About the Role</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {jobDetails.job_description}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Required Skills</h3>
                <ul className="text-muted-foreground space-y-2">
                  {jobDetails.required_skills.map((skill) => (
                    <li key={skill} className="flex items-start">
                      <span className="w-2 h-2 bg-gradient-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>

              {jobDetails.preferred_skills.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Preferred Skills
                  </h3>
                  <ul className="text-muted-foreground space-y-2">
                    {jobDetails.preferred_skills.map((skill) => (
                      <li key={skill} className="flex items-start">
                        <span className="w-2 h-2 bg-gradient-secondary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Application Form */}
        <Card className="shadow-brand">
          <CardHeader>
            <CardTitle className="text-2xl">Application Form</CardTitle>
            <CardDescription>
              Please fill out all required fields to submit your application
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === 1 ? (
              <FormStep1
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
                onNext={handleNext}
              />
            ) : (
              <FormStep2
                formData={formData}
                errors={errors}
                isSubmitting={isSubmitting}
                onInputChange={handleInputChange}
                onFileUpload={handleFileUpload}
                onRemoveFile={removeFile}
                onSubmit={handleSubmit}
                onBack={handleBack}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
