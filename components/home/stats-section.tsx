import { BookOpen, Users, Download, Clock } from "lucide-react"

export function StatsSection() {
  const features = [
    {
      icon: BookOpen,
      title: "Consultation libre",
      description: "Accédez gratuitement à toutes les œuvres approuvées du catalogue",
    },
    {
      icon: Users,
      title: "Contribution ouverte",
      description: "Les membres peuvent soumettre leurs œuvres pour enrichir la collection",
    },
    {
      icon: Download,
      title: "Téléchargement",
      description: "Téléchargez les œuvres pour une lecture hors ligne",
    },
    {
      icon: Clock,
      title: "Emprunt numérique",
      description: "Système d'emprunt pour gérer votre bibliothèque personnelle",
    },
  ]

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Comment ça marche ?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Une plateforme pédagogique pour découvrir, partager et préserver le savoir numérique
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
