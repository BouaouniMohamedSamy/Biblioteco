import { SignUpForm } from "@/components/auth/signup-form"

export const metadata = {
  title: "Inscription - BiblioLib",
  description: "Créez votre compte membre",
}

export default function SignUpPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Inscription</h1>
          <p className="text-muted-foreground">Devenez membre et contribuez à la bibliothèque</p>
        </div>
        <SignUpForm />
      </div>
    </div>
  )
}
