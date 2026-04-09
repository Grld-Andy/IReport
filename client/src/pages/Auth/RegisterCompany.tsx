import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Toaster } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Paystack from "@paystack/inline-js";
import { SiGoogleauthenticator } from "react-icons/si";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Upload,
  CreditCard,
  Building2,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  companyRegistrationSchema,
  type CompanyRegistration,
} from "@/types/Onboarding";
import { registerCompany } from "@/services/company/registerCompany";
import { cn } from "@/lib/utils";
import { initializePayment } from "@/services/payment/payment";

const STEPS = [
  { id: "admin", title: "Admin Info", icon: User },
  { id: "company", title: "Company Info", icon: Building2 },
  { id: "payment", title: "Payment", icon: CreditCard },
  { id: "review", title: "Review", icon: Check },
];

const RegisterCompany: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [paymentReference, setPaymentReference] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const popup = new Paystack();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<CompanyRegistration>({
    resolver: zodResolver(companyRegistrationSchema),
    mode: "onChange",
  });

  const formData = watch();

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("companyLogo", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof CompanyRegistration)[] = [];
    if (currentStep === 0) {
      fieldsToValidate = ["adminName", "adminEmail", "adminPhone"];
    } else if (currentStep === 1) {
      fieldsToValidate = ["companyName"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handlePayment = async () => {
    try {
      if (!formData.adminEmail) {
        toast.error("Enter email before payment");
        return;
      }
      setLoadingPayment(true);

      const result = await initializePayment(formData.adminEmail);

      if (result.success) {
        popup.resumeTransaction(result.data.access_code, {
          onSuccess: (transaction: {message: string, reference: string}) => {
            if (transaction.message == "Approved") {
              setPaymentReference(transaction.reference);
            } else {
              toast.error(transaction.message);
            }
          },
          onCancel: () => {
            toast.message("Payment was cancelled")
          }
        });
      } else {
        toast.error(result.message);
      }
    } finally {
      setLoadingPayment(false);
    }
  };

  const onSubmit = async (data: CompanyRegistration) => {
    if (!paymentReference) {
      toast.error("Please complete payment first");
      return;
    }

    setIsSubmitting(true);
    const { success, message } = await registerCompany(data, paymentReference);
    if (success) {
      toast.success(
        "Registration complete! Check email to activate account and login",
      );
    } else {
      toast.error(message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Toaster position="top-center" richColors />
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="text-black">
            <SiGoogleauthenticator size={32} />
          </span>
          <span className="text-xl font-bold font-serif">SafeZone</span>
        </div>
        <Link
          to="/auth/login"
          className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
        >
          Back to Login
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center py-12 px-4">
        <div className="w-full max-w-2xl">
          {/* Progress Bar */}
          <div className="mb-16">
            <div className="flex justify-between relative">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
              <div
                className="absolute top-1/2 left-0 h-0.5 bg-black -translate-y-1/2 z-0 transition-all duration-500"
                style={{
                  width: `${(currentStep / (STEPS.length - 1)) * 100}%`,
                }}
              ></div>
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                const isActive = index <= currentStep;
                const isCompleted = index < currentStep;
                return (
                  <div
                    key={step.id}
                    className="relative z-10 flex flex-col items-center"
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                        isActive
                          ? "bg-black border-black text-white"
                          : "bg-white border-gray-200 text-gray-400",
                        isCompleted && "bg-green-500 border-green-500",
                      )}
                    >
                      {isCompleted ? <Check size={18} /> : <Icon size={18} />}
                    </div>
                    <span
                      className={cn(
                        "text-xs font-semibold mt-2 absolute -bottom-6 whitespace-nowrap",
                        isActive ? "text-black" : "text-gray-400",
                      )}
                    >
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-black">
                        Admin Details
                      </h2>
                      <p className="text-gray-500">
                        Create your administrator account
                      </p>
                    </div>
                    <FieldGroup>
                      <Field>
                        <FieldLabel>Full Name</FieldLabel>
                        <Input
                          placeholder="John Doe"
                          {...register("adminName")}
                          className="h-11 focus:ring-black"
                        />
                        {errors.adminName && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.adminName.message}
                          </p>
                        )}
                      </Field>
                      <Field>
                        <FieldLabel>Email Address</FieldLabel>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          {...register("adminEmail")}
                          className="h-11 focus:ring-black"
                        />
                        {errors.adminEmail && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.adminEmail.message}
                          </p>
                        )}
                      </Field>
                      <Field>
                        <FieldLabel>Phone Number</FieldLabel>
                        <Input
                          type="tel"
                          placeholder="+233 24 000 0000"
                          {...register("adminPhone")}
                          className="h-11 focus:ring-black"
                        />
                        {errors.adminPhone && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.adminPhone.message}
                          </p>
                        )}
                      </Field>
                    </FieldGroup>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-black">
                        Company Details
                      </h2>
                      <p className="text-gray-500">
                        Tell us about your organization
                      </p>
                    </div>
                    <FieldGroup>
                      <Field>
                        <FieldLabel>Company Name</FieldLabel>
                        <Input
                          placeholder="Acme Inc."
                          {...register("companyName")}
                          className="h-11 focus:ring-black"
                        />
                        {errors.companyName && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.companyName.message}
                          </p>
                        )}
                      </Field>
                      <Field>
                        <FieldLabel>Company Logo (Optional)</FieldLabel>
                        <div className="mt-2 flex items-center gap-4">
                          <div className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50 shrink-0">
                            {logoPreview ? (
                              <img
                                src={logoPreview}
                                className="w-full h-full object-cover"
                                alt="Logo preview"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <Building2 className="text-gray-300" size={32} />
                            )}
                          </div>
                          <div className="flex-1">
                            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
                              <Upload size={16} />
                              <span>Choose Image</span>
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleLogoChange}
                              />
                            </label>
                            <p className="text-xs text-gray-400 mt-2">
                              PNG, JPG or SVG. Max 2MB.
                            </p>
                          </div>
                        </div>
                      </Field>
                    </FieldGroup>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-black">
                        Subscription Payment
                      </h2>
                      <p className="text-gray-500">
                        Choose your plan and complete payment
                      </p>
                    </div>

                    <div className="bg-gray-50 border-2 border-black rounded-2xl p-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-black text-white px-4 py-1 text-xs font-bold rounded-bl-xl">
                        LIFETIME ACCESS
                      </div>
                      <h3 className="text-xl font-bold">Premium Plan</h3>
                      <p className="text-gray-500 text-sm mt-1">
                        One-time payment for lifetime access
                      </p>
                      <div className="mt-6 flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold">Ghc 500</span>
                        <span className="text-gray-400 text-sm">/ forever</span>
                      </div>
                      <ul className="mt-6 space-y-3">
                        {[
                          "Unlimited Users",
                          "Priority Support",
                          "Custom Branding",
                          "Advanced Analytics",
                        ].map((feat) => (
                          <li
                            key={feat}
                            className="flex items-center gap-2 text-sm text-gray-700"
                          >
                            <Check size={16} className="text-green-500" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4">
                      {paymentReference ? (
                        <div className="bg-green-50 border border-green-200 text-green-900 p-4 rounded-xl flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                            <Check size={18} />
                          </div>
                          <div>
                            <p className="font-bold">Payment Verified</p>
                            <p className="text-xs opacity-80">
                              Ref: {paymentReference}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <Button
                          onClick={handlePayment}
                          disabled={loadingPayment}
                          className={`w-full h-14 text-lg gap-2 bg-black hover:bg-black/90 text-white ${loadingPayment ? "opacity-80" : ""}`}
                        >
                          <CreditCard size={20} />
                          Make Payment
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-black">
                        Review & Submit
                      </h2>
                      <p className="text-gray-500">
                        Please verify your details before finishing
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                          Admin Information
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Name</p>
                            <p className="text-sm font-semibold">
                              {formData.adminName}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="text-sm font-semibold">
                              {formData.adminEmail}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Phone</p>
                            <p className="text-sm font-semibold">
                              {formData.adminPhone}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                          Company Information
                        </h4>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
                            {logoPreview ? (
                              <img
                                src={logoPreview}
                                className="w-full h-full object-cover"
                                alt="Logo"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <Building2 className="text-gray-300" size={24} />
                            )}
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">
                              Company Name
                            </p>
                            <p className="text-sm font-semibold">
                              {formData.companyName}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                          Payment Details
                        </h4>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-xs text-gray-500">Reference</p>
                            <p className="text-sm font-mono font-semibold">
                              {paymentReference}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Amount</p>
                            <p className="text-sm font-bold">Ghc 500.00</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleSubmit(onSubmit)}
                      disabled={isSubmitting}
                      className="w-full h-14 text-lg bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Registering...</span>
                        </div>
                      ) : (
                        <span>Complete Registration</span>
                      )}
                    </Button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="mt-10 pt-6 border-t flex items-center justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0 || isSubmitting}
                className={cn("gap-2", currentStep === 0 && "invisible")}
              >
                <ChevronLeft size={18} />
                Back
              </Button>

              {currentStep < 2 && (
                <Button
                  onClick={nextStep}
                  className="gap-2 px-8 bg-black text-white hover:bg-black/90"
                >
                  Next
                  <ChevronRight size={18} />
                </Button>
              )}

              {currentStep === 2 && paymentReference && (
                <Button
                  onClick={() => setCurrentStep(3)}
                  className="gap-2 px-8 bg-black text-white hover:bg-black/90"
                >
                  Next
                  <ChevronRight size={18} />
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterCompany;
