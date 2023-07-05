import Artists from '@/components/Artists';

export default function Page({ params }) {
  return <Artists current={params.name.toLowerCase().replaceAll('%20', '_')} />;
}
