import React from "react";
import "../../../assets/css/user/ContactAndTerms.css";
import UserNav from "../../partials/user/UserNav";

const ContactAndTerms: React.FC = () => {
  return (
    <>
      <UserNav />
      <div className="bmwevbunk-container">
        <section className="bmwevbunk-contact-section">
          <h2>Contact Support</h2>
          <p>
            If you have any questions or concerns, feel free to reach out to our
            support team.
          </p>
          <ul>
            <li>
              <strong>Email:</strong> support@bmwevbunk.com
            </li>
            <li>
              <strong>Phone:</strong> +91 7012143978
            </li>
            <li>
              <strong>Address:</strong> BMW EV Bunk HQ, Electric Avenue,
              Bengaluru, India
            </li>
          </ul>
        </section>

        <section className="bmwevbunk-terms-section">
          <h2>Terms and Conditions</h2>
          <p>
            By using our EV Bunk services, you agree to the following terms:
          </p>
          <ul>
            <li>
              Users must own a valid EV vehicle registration to access charging
              services.
            </li>
            <li>
              Charging fees are applicable and displayed at the time of charging
              initiation.
            </li>
            <li>
              BMW EV Bunk is not responsible for damages due to user mishandling
              of charging equipment.
            </li>
            <li>
              We reserve the right to deny service in case of misuse or safety
              concerns.
            </li>
            <li>
              User data is protected in accordance with Indian data protection
              regulations.
            </li>
          </ul>
          <p>
            These terms are subject to change. Please check regularly for
            updates.
          </p>
        </section>
      </div>
    </>
  );
};

export default ContactAndTerms;
