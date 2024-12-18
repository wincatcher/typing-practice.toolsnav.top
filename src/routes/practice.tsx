import { Link, createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { useSentenceStore } from '../store/sentenceStore'
import { useCustomTextStore } from '../store/customTextStore'
import TypingTest from '../components/TypingTest'
import { shuffleArray, formatText } from '../lib/utils'
import { ArrowLeft, HomeIcon } from 'lucide-react'

const topicsSearchSchema = z.object({
  topic: z.string().catch('biology'),
  eclipsedTime: z.number().catch(15),
})

export const Route = createFileRoute('/practice')({
  component: () => <Practice />,
  validateSearch: (search: Record<string, unknown>) => topicsSearchSchema.parse(search)
})

const Practice = () => {
  const { topic, eclipsedTime } = Route.useSearch()
  
  if (topic === 'custom') {
    const customTexts = useCustomTextStore.getState().texts;
    const selectedTexts = customTexts.filter(text => text.selected);
    if (selectedTexts.length === 0) {
      return <div className='grid place-items-center p-12'>
        <div className='flex flex-col items-center'>
          <h1 className='mb-4 font-bold text-3xl text-center'>请选择要练习的文本!</h1>
          <Link to='/'>
            <button className='btn btn-success btn-outline'>
              <HomeIcon className='h-5 w-5' />
              返回首页
            </button>
          </Link>
        </div>
      </div>
    }
    const formattedText = formatText(selectedTexts.map(t => t.text));
    return <TypingTest eclipsedTime={eclipsedTime} text={formattedText} />
  }

  const sentences = useSentenceStore((state) => state.getSentencesByTopic(topic || ''));
  
  if (sentences.length === 0) {
    return <div className='grid place-items-center p-12'>
      <div className='flex flex-col items-center'>
        <h1 className='mb-4 font-bold text-3xl text-center'>未找到主题 {topic} 的文本!</h1>
        <div className='flex items-center gap-2'>
          <button onClick={() => history.back()} className='btn btn-success btn-outline'>
            <ArrowLeft className='h-5 w-5' />
            返回
          </button>
          <Link to='/'>
            <button className='btn btn-success btn-outline'>
              <HomeIcon className='h-5 w-5' />
              返回首页
            </button>
          </Link>
        </div>
      </div>
    </div>
  }
  
  const selectedSentences = shuffleArray([...sentences]).slice(0, 5);
  const formattedText = formatText(selectedSentences);
  return <TypingTest eclipsedTime={eclipsedTime} text={formattedText} />
}