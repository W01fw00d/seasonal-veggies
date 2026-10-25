import { PageContainer } from "./page-container";

type Props = {
  className?: string;
  id?: string;
};

export function Default({ className, id }: Props) {
  return (
    <PageContainer
      className={className}
      data-testid="page-container"
      id={id}
    >
      Page content
    </PageContainer>
  );
}
