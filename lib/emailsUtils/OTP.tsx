import * as React from "react";
import {
    Body,
    Container,
    Head,
    Hr,
    Html,
    Link,
    Preview,
    Section,
    Text,
} from "@react-email/components";

type EmailProps = {
    name: string;
    OTP: string;
    label: string;
    description: string;
};

const DOMAIN = process.env.DOMAIN_NAME;

const OTP = ({ name, OTP, label, description }: EmailProps) => {

    const copyOTP = async () => {
        await navigator.clipboard.writeText(OTP.toString());
        alert(`OTP copied to clipboard - ${OTP}`);
    }
    return (
        <Html>
            <Head />
            <Preview>{label}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section>
                        <Text style={text}>Hi {name},</Text>
                        <Text style={text}>
                            Your One Time (OTP) is:{" "}<Text style={copyText} onClick={copyOTP}>{OTP}</Text>
                        </Text>
                        <Text style={text}>
                            {description}
                        </Text>
                        <Hr />
                        <Text style={text}>
                            To keep your account secure, please don&apos;t forward this email
                            to anyone. See our Help Center for{" "}
                            <Link style={anchor} href={`${DOMAIN}/help`}>
                                more security tips.
                            </Link>
                        </Text>
                        <Text style={text}>Happy day {name}</Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

const main = {
    backgroundColor: "#f6f9fc",
    padding: "10px 0",
};

const container = {
    backgroundColor: "#ffffff",
    border: "1px solid #f0f0f0",
    padding: "45px",
};

const text = {
    fontSize: "16px",
    fontFamily:
        "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
    fontWeight: "300",
    color: "#404040",
    lineHeight: "26px",
};

const copyText = {
    fontSize: "16px",
    fontFamily:
        "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
    fontWeight: "300",
    color: "#404040",
    lineHeight: "26px",
    cursor: "pointer",
};

const button = {
    backgroundColor: "#007ee6",
    borderRadius: "4px",
    color: "#fff",
    fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
    fontSize: "15px",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "block",
    width: "210px",
    padding: "14px 7px",
};

const anchor = {
    textDecoration: "underline",
};

export default OTP;