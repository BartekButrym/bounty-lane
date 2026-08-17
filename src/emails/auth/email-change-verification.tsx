import {
  Body,
  Container,
  Head,
  Html,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

type EmailChangeVerificationProps = {
  toName: string;
  code: string;
};

const EmailChangeVerification = ({
  toName,
  code,
}: EmailChangeVerificationProps) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="font-sans m-8 text-center">
          <Container>
            <Section>
              <Text>
                Hello {toName}, please confirm your new email address by using
                the following code:
              </Text>
            </Section>
            <Section>
              <Text className="bg-black rounded text-white p-2 m-2">
                {code}
              </Text>
            </Section>
            <Section>
              <Text>
                If you did not request this change, you can safely ignore this
                email.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

EmailChangeVerification.PreviewProps = {
  toName: 'John Doe',
  code: 'PTLMYLBU',
};

export default EmailChangeVerification;
