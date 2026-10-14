import { notFound } from 'next/navigation';
import FeedbackFormPage from '@/components/FeedbackFormPage';
import {
  FEEDBACK_PAGES,
  buildFeedbackSupabaseInline,
  getFeedbackPage,
  renderStandardFeedbackForm,
} from '@/lib/feedbackConfig';
import { loadLegacyFeedbackHtml } from '@/lib/loadLegacyFeedback';

export function generateStaticParams() {
  return Object.keys(FEEDBACK_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const config = getFeedbackPage(slug);
  if (!config) return { title: 'Feedback | Nawal Yoga' };
  return {
    title: config.title || 'Feedback | Nawal Yoga',
    description: config.description || 'شاركينا تقييم تجربتك مع Nawal Yoga',
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const config = getFeedbackPage(slug);
  if (!config) notFound();

  const feedbackSupabaseInline = buildFeedbackSupabaseInline();

  if (config.type === 'legacy') {
    const legacy = loadLegacyFeedbackHtml(config.legacyFile);
    return (
      <FeedbackFormPage
        config={null}
        html={legacy.html}
        inlineScripts={legacy.scripts}
        feedbackSupabaseInline={feedbackSupabaseInline}
      />
    );
  }

  return (
    <FeedbackFormPage
      config={config}
      html={renderStandardFeedbackForm(config)}
      feedbackSupabaseInline={feedbackSupabaseInline}
    />
  );
}
