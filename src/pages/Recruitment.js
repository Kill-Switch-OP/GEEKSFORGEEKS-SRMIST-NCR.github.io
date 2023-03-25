import emailjs from "@emailjs/browser";
import { supabase } from "api/supabase";
import { Banner } from "components/index";
import RecruitmentForm from "components/RecruitmentForm";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

const Recruitment = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [_, removeCookie] = useCookies(); // eslint-disable-line no-unused-vars

  useEffect(() => {
    removeCookie("banner");
  }, [removeCookie]);

  const submitData = async (data, e) => {
    setLoading(true);
    await supabase
      .from("Recruitment2023")
      .insert({
        ...data,
        resume: data.resume.length === 0 ? " " : data.name + "-" + Date.now(),
      })
      .then(
        data.resume.length === 0
          ? ""
          : await supabase.storage
              .from("recruitment")
              .upload(
                `resume2023/${data.name}-${Date.now()}.pdf`,
                data.resume[0]
              )
      )
      .then(() => {
        e.target.reset();
        setLoading(false);
        setSubmitted(true);
        emailjs.send(
          process.env.GATSBY_EMAIL_ID,
          process.env.GATSBY_TEMPLATE_ID,
          {
            name: data.name,
            email: data.email,
          },
          process.env.GATSBY_EMAIL_KEY
        );
        setTimeout(() => {
          setSubmitted(false);
        }, 20000);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <>
      <h1 className="section-title">Recruitment Form</h1>
      <RecruitmentForm
        submitData={submitData}
        submitted={submitted}
        loading={loading}
      />
      {submitted && (
        <Banner
          title="Submitted"
          subtitle="Your application was successfully submitted. Click here to go home."
          link="/"
        />
      )}
    </>
  );
};

export default withCookies(Recruitment);