import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { articles } from '@/lib/articles'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const article = articles.find((a) => a.id.toString() === resolvedParams.id)

  if (!article) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link href="/articles">
            <Button variant="ghost" className="mb-8 pl-0 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Artikel
            </Button>
          </Link>
          
          <div className="mb-8">
            <div className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
              {article.category}
            </div>
            <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-5xl">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                <span>{article.date}</span>
              </div>
            </div>
          </div>

          <div className="mb-12 aspect-video w-full overflow-hidden rounded-2xl bg-muted shadow-lg">
            <img 
              src={article.image} 
              alt={article.title}
              className="h-full w-full object-cover"
            />
          </div>

          <article 
            className="text-lg leading-relaxed text-foreground/90 space-y-6 pb-12 border-b"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          <div className="mt-12 text-center">
            <h3 className="text-2xl font-bold mb-4">Bagikan Artikel Ini</h3>
            <div className="flex justify-center gap-4">
              <Button variant="outline">Salin Tautan</Button>
              <Button variant="outline">Facebook</Button>
              <Button variant="outline">Twitter</Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
