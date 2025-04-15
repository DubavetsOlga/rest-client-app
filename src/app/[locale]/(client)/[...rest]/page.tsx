import { notFound } from 'next/navigation';
import { HttpMethod } from '@/shared/models/httpMethod';

type Props = {
  params: {
    locale: string;
    rest: string[];
  };
};

export default async function RestResult({ params }: Props) {
  const { rest } = await params;

  const [method = '', , , ...other] = rest;

  if (!(method.toUpperCase() in HttpMethod) || other.length > 0) {
    notFound();
  }

  return <></>;
}
