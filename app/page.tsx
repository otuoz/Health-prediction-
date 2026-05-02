import { HealthHero } from '@/components/health-hero';
import { DiseaseCard } from '@/components/disease-card';
import { MedicalDisclaimer } from '@/components/medical-disclaimer';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HealthHero />
      
      {/* Disease Selection Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                Choose Your Assessment
              </h2>
              <p className="mt-3 text-muted-foreground">
                Select a condition to begin your personalized risk assessment
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <DiseaseCard disease="diabetes" index={0} />
              <DiseaseCard disease="cardiovascular" index={1} />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-t bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-12 text-center text-2xl font-bold text-foreground md:text-3xl">
              How It Works
            </h2>
            
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  step: '01',
                  title: 'Enter Your Data',
                  description: 'Provide your health metrics through our guided assessment form.',
                },
                {
                  step: '02',
                  title: 'ML Analysis',
                  description: 'Our validated models analyze your data using peer-reviewed algorithms.',
                },
                {
                  step: '03',
                  title: 'Get Insights',
                  description: 'Receive your risk score with detailed explanations and recommendations.',
                },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                    {item.step}
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <MedicalDisclaimer />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Built with validated ML models from the Pima Indians Diabetes Dataset 
            and Framingham Heart Study.
          </p>
          <p className="mt-2">
            For educational purposes only. Not a substitute for professional medical advice.
          </p>
        </div>
      </footer>
    </main>
  );
}
