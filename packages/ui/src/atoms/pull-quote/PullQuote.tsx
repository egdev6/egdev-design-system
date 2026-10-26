import type { FC } from 'react';
import type { PullQuoteProps } from './types';
import { usePullQuote } from './usePullQuote';

/** One editorial quotation with an optional source caption outside the quoted passage. */
export const PullQuote: FC<PullQuoteProps> = (props) => {
  const quote = usePullQuote(props);
  if (!quote.visible) {
    return null;
  }
  return (
    <figure {...quote.rootProps}>
      <blockquote {...quote.quotationProps}>
        <p className={quote.passageClassName}>
          {quote.text}
          {quote.accent ? <span className={quote.accent.className}>{quote.accent.text}</span> : null}
        </p>
      </blockquote>
      {quote.source ? <figcaption className={quote.source.className}>{quote.source.text}</figcaption> : null}
    </figure>
  );
};
