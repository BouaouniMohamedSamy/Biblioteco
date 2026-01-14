import { SignInForm } from "@/components/auth/signin-form"

export const metadata = {
  title: "Connexion - BiblioLib",
  description: "Connectez-vous à votre compte",
}

export default function SignInPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Connexion</h1>
          <p className="text-muted-foreground">Accédez à votre espace membre</p>
        </div>
        <SignInForm />
      </div>
    </div>
  )
}
