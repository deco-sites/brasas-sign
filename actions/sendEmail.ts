import { AppContext } from "site/apps/site.ts";

export interface DataProps {
  name: string;
  email: string;
  tel: string;
  uf: string;
  city: string;
  whereMeetAurora: string;
}

export interface Attachment {
  filename: string;
  type: string;
  content: string;
}

export interface RecipientsEmail {
  email: string;
}

export interface CopyEmail {
  email?: string;
}

export interface Props {
  RecipientsEmailArr: RecipientsEmail[];
  CopyToArr?: CopyEmail[];
  data: string; //DataProps
  subject: string;
  attachments?: Attachment | null;
}

const sendEmail = async (
  props: Props,
  _req: Request,
  ctx: AppContext,
) => {
  const { sendgrid } = ctx;

  const msg = {
    "personalizations": [
      {
        "to": props.RecipientsEmailArr.map((emailObj) => ({
          email: emailObj.email,
        })),

        // Adiciona "cc" apenas se props.CopyToArr existir e não for vazio
        ...(props.CopyToArr && props.CopyToArr.length > 0
          ? {
            "cc": props.CopyToArr.map((emailObj) => ({
              email: emailObj.email,
            })),
          }
          : {}),
      },
    ],
    "subject": props.subject,
    "from": {
      "email": "nao_responder@brasas.com",
    },
    "content": [
      {
        "type": "text/html",
        "value": props.data,
      },
    ],
  };

  if (props.attachments) {
    msg.attachments = [
      {
        "content": props.attachments.content,
        "filename": props.attachments.filename,
        "type": props.attachments.type,
        "disposition": "attachment",
      },
    ];
  }

  try {
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${sendgrid}`,
      },
      body: JSON.stringify(msg),
    });

    if (response.ok) {
      console.log("Email sent successfully");
    } else {
      const errorData = await response.json();
      console.error("SendGrid API error:", errorData);
    }
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export default sendEmail;
