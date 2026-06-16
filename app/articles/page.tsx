import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BookOpen, ArrowRight } from 'lucide-react'
import { articles } from '@/lib/articles'

export default function ArticlesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-8 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <BookOpen className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Artikel Kesehatan
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-lg text-muted-foreground">
            Temukan informasi kesehatan terpercaya, tips gaya hidup sehat, dan berita medis terbaru dari para ahli kami.
          </p>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link href={`/articles/${article.id}`} key={article.id}>
                <Card className="h-full overflow-hidden text-left transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
                  <div className="aspect-video relative overflow-hidden bg-muted">
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
                      {article.category}
                    </div>
                    <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
                      {article.summary}
                    </p>
                    <div className="flex items-center text-sm font-medium text-primary">
                      Baca Selengkapnya <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-16 rounded-2xl bg-primary p-8 text-white sm:p-12">
            <h2 className="mb-4 text-2xl font-bold sm:text-3xl">Ingin mendapatkan update kesehatan?</h2>
            <p className="mb-8 text-primary-foreground/80">Berlangganan buletin kami untuk mendapatkan artikel terbaru langsung di email Anda.</p>
            <div className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
              <input 
                type="email" 
                placeholder="Alamat email Anda" 
                className="flex-1 rounded-lg border-none px-4 py-3 text-foreground focus:ring-2 focus:ring-primary-foreground"
              />
              <Button variant="secondary" size="lg">
                Berlangganan
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
