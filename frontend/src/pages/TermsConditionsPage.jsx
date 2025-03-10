import React from 'react'

function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6 m-8 rounded-2xl">
      <div className="container mx-auto bg-white shadow-2xl rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-center mb-16 text-gray-800">
          Terms and Conditions
        </h1>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Terms and Conditions
          </h2>
          <p className="text-gray-600 mb-4">
            Welcome to <strong>IADA Baddi.com</strong>. By accessing or using our website, you agree to be bound by these terms and conditions. If you do not agree with any part of these Terms, you must not use our services.
          </p>

          <ul className="list-disc ml-6 text-gray-600 mb-4">
            <li>
              <strong>"We," "Us," "Our"</strong>: Refers to IADA Baddi.
            </li>
            <li>
              <strong>"You," "User"</strong>: Refers to the person or entity accessing our services.
            </li>
            <li>
              <strong>"Service"</strong>: Refers to the services provided by us, including but not limited to our website, applications, and payment gateway.
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Account Information
          </h3>
          <p className="text-gray-600 mb-4">
            You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account and password. You agree to notify us immediately of any unauthorized use of your account.
          </p>

          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Payment Terms
          </h3>
          <p className="text-gray-600 mb-4">
            By using our payment gateway, you agree to provide valid payment details. Payments are processed through third-party payment gateways, and by using them, you agree to their terms of service. We are not liable for any issues arising from the payment gateway’s services. All payments are final, and we do not offer refunds except where required by law.
          </p>

          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Intellectual Property
          </h3>
          <p className="text-gray-600 mb-4">
            You may not use, reproduce, or distribute any content from our website without our explicit permission.
          </p>

          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Changes to Terms
          </h3>
          <p className="text-gray-600">
            We reserve the right to modify these Terms at any time. Any changes will be posted on this page, and your continued use of our services constitutes your acceptance of the modified Terms.
          </p>
        </section>
      </div>
    </div>
  
  )
}

export default TermsConditionsPage