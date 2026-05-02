'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Share2, RefreshCw, Droplet, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RiskGauge } from '@/components/risk-gauge';
import { FeatureImportanceChart } from '@/components/feature-importance-chart';
import { RiskFactorsBreakdown } from '@/components/risk-factors-breakdown';
import { RecommendationsPanel } from '@/components/recommendations-panel';
import { MedicalDisclaimer } from '@/components/medical-disclaimer';
import type { PredictionResult } from '@/types/health';

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params.id as string;
    
    // Try to get result from sessionStorage
    const stored = sessionStorage.getItem(`prediction_${id}`);
    
    if (stored) {
      try {
        setResult(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored result:', e);
      }
    }
    
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="size-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="mx-4 max-w-md">
          <CardHeader>
            <CardTitle>Results Not Found</CardTitle>
            <CardDescription>
              We could not find the results you are looking for. Results are only stored temporarily in your browser.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button className="w-full">
                <ArrowLeft className="mr-2 size-4" />
                Start New Assessment
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isDiabetes = result.disease === 'diabetes';
  const Icon = isDiabetes ? Droplet : Heart;
  const diseaseLabel = isDiabetes ? 'Type 2 Diabetes' : 'Cardiovascular Disease';
  const gradientClass = isDiabetes ? 'from-chart-2/5' : 'from-destructive/5';

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${diseaseLabel} Risk Assessment Results`,
          text: `My ${diseaseLabel} risk assessment shows ${result.riskPercentage}% risk.`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleDownload = () => {
    const data = JSON.stringify(result, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-assessment-${result.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className={`min-h-screen bg-gradient-to-b ${gradientClass} via-background to-background py-8`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4 gap-2">
              <ArrowLeft className="size-4" />
              Back to Home
            </Button>
          </Link>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className={`rounded-xl p-3 ${isDiabetes ? 'bg-chart-2/20' : 'bg-destructive/20'}`}>
                <Icon className={`size-6 ${isDiabetes ? 'text-chart-2' : 'text-destructive'}`} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{diseaseLabel} Risk Results</h1>
                <p className="text-sm text-muted-foreground">
                  Assessment completed {new Date(result.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
                <Share2 className="size-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2">
                <Download className="size-4" />
                Download
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Risk Gauge and Summary */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">Your Risk Score</CardTitle>
                  <CardDescription>
                    {isDiabetes ? 'Estimated probability of Type 2 Diabetes' : '10-Year cardiovascular disease risk'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center pb-8">
                  <RiskGauge 
                    percentage={result.riskPercentage} 
                    riskCategory={result.riskCategory}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {result.summary}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Charts and Details */}
          <div className="space-y-6 lg:col-span-2">
            <FeatureImportanceChart contributions={result.featureContributions} />
            <RiskFactorsBreakdown contributions={result.featureContributions} />
            <RecommendationsPanel recommendations={result.recommendations} />
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12">
          <MedicalDisclaimer />
        </div>

        {/* Footer Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link href={isDiabetes ? '/predict/diabetes' : '/predict/cardiovascular'}>
            <Button variant="outline" className="gap-2">
              <RefreshCw className="size-4" />
              Retake Assessment
            </Button>
          </Link>
          <Link href="/">
            <Button className="gap-2">
              Try {isDiabetes ? 'Cardiovascular' : 'Diabetes'} Assessment
              {isDiabetes ? <Heart className="size-4" /> : <Droplet className="size-4" />}
            </Button>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
