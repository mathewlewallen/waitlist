import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  //Img,
  Preview,
  Text,
} from "@react-email/components";
import * as React from "react";

interface EmailProps {
  userFirstname: string;
}

export const WaitlistEmail = ({ userFirstname }: EmailProps) => (
  <Html>
    <Head />
    <Preview>Thanks for Joining the Waitlist, {userFirstname}! 🎉</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* TODO: Add logo */}
        {/* <Img
          src={`/waitlist-logo.png`}
          width="220"
          height="100"
          alt=" Waitlist Logo"
          style={logo}
        /> */}
        <Text style={greeting}>Hi {userFirstname},</Text>
        <Text style={paragraph}>
          Thanks for joining the waitlist for our Next.js +  CMS waitlist
          template! Im Lakshay, the developer behind this project. Im glad to
          have you on board.
        </Text>
        <Text style={paragraph}>
          Ill keep you posted on the progress and notify you as soon as it&apos;s
          ready for you to use. In the meantime, if you have any questions or
          feedback, dont hesitate to reach out by replying directly to{" "}
          <a href="mailto:lakshb.work@gmail.com" style={link}>
            this email {""}
          </a>
          — Im here to listen!
        </Text>
        <Text style={paragraph}>
          You can also follow me on X/Twitter for updates:{" "}
          <a href="https://x.com/blakssh" style={link}>
            @blakssh
          </a>
        </Text>
        <Text style={signOff}>
          Best regards,
          <br />
          Lakshay
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          You received this email because you signed up for the  waitlist.
          If you believe this is a mistake, feel free to ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
);

WaitlistEmail.PreviewProps = {
  userFirstname: "Tyler",
} as EmailProps;

export default WaitlistEmail;

const main = {
  background: "linear-gradient(-225deg, #FFE29F 0%, #FFA99F 48%, #FF719A 100%)",
  fontFamily: 'figtree, "Helvetica Neue", Helvetica, Arial, sans-serif',
  padding: "40px 0",
  color: "#cccccc",
};

const container = {
  margin: "0 auto",
  padding: "24px 32px 48px",
  backgroundColor: "#1a1a1a",
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  maxWidth: "600px",
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logo = {
  margin: "0 auto",
  paddingBottom: "20px",
};

const greeting = {
  fontSize: "18px",
  lineHeight: "28px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  marginBottom: "20px",
};

const link = {
  color: "#F7FF9B",
  textDecoration: "underline",
};

const signOff = {
  fontSize: "16px",
  lineHeight: "26px",
  marginTop: "20px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8c8c8c",
  fontSize: "12px",
};
