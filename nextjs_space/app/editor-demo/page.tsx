
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { EditablePageWrapper } from '@/components/editor/editable-page-wrapper'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function EditorDemoPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || ((session.user as any).role !== 'SUPER_ADMIN' && (session.user as any).role !== 'ADMIN')) {
    redirect('/')
  }

  return (
    <>
      <EditablePageWrapper pageName="editor-demo">
        <div className="min-h-screen">
          <Header />
          <main>
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-easymeals-green to-green-700 text-white py-20">
              <div className="container mx-auto px-4 text-center">
                <h1 className="text-5xl font-bold mb-6">Welcome to the Visual Editor Demo</h1>
                <p className="text-xl mb-8">
                  This page demonstrates the visual editor. As an admin, you can click "Edit Page" to start editing!
                </p>
                <button className="bg-white text-easymeals-green px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                  Get Started
                </button>
              </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
              <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-12">Amazing Features</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="text-6xl mb-4">✓</div>
                    <h3 className="text-2xl font-bold mb-3">Click to Edit</h3>
                    <p className="text-gray-600">Click on any text or image to edit it directly on the page</p>
                  </div>
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎨</div>
                    <h3 className="text-2xl font-bold mb-3">Style Editor</h3>
                    <p className="text-gray-600">Change colors, fonts, spacing, and more with the style editor</p>
                  </div>
                  <div className="text-center">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-2xl font-bold mb-3">Add Blocks</h3>
                    <p className="text-gray-600">Add new sections with pre-designed blocks and templates</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Call to Action */}
            <section className="bg-gray-100 py-16">
              <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to Start Editing?</h2>
                <p className="text-xl text-gray-600 mb-8">
                  Click the "Edit Page" button in your user menu or the floating button at the bottom right
                </p>
              </div>
            </section>
          </main>
          <Footer />
        </div>
      </EditablePageWrapper>
    </>
  )
}
