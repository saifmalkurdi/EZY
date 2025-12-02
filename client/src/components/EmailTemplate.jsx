function EmailTemplate({ userEmail = "username@gmail.com" }) {
  return (
    <div className="max-w-2xl mx-auto bg-white p-8">
      {/* Email Container with Border */}
      <div className="border-4 border-[#003D7A] rounded-lg overflow-hidden">
        {/* Header with Logo */}
        <div className="bg-white border-b-4 border-[#003D7A] p-8">
          <div className="border-2 border-dashed border-gray-300 inline-block p-4">
            <img src="/logo.svg" alt="EZY Skills" className="h-16" />
          </div>
        </div>

        {/* Email Body */}
        <div className="p-8 space-y-6">
          {/* Greeting */}
          <p className="text-gray-800 font-medium">Dear Sir/Madam,</p>

          {/* Thank You Message */}
          <p className="text-gray-700 leading-relaxed">
            We thank you for your interest in Ezy Skills.
          </p>

          {/* Main Message */}
          <p className="text-gray-700 leading-relaxed">
            In the meanwhile, we would like to take this oppurtunity in
            congratulating you for initiating the fiorst step towards choosing
            your career. We wish you the best for your future.
          </p>

          {/* Contact Message */}
          <p className="text-gray-700 leading-relaxed">
            Please feel free too reach ou to mus for any further concerns ir
            queries.
          </p>

          {/* Sign Off */}
          <div className="pt-4">
            <p className="text-gray-800 font-medium">Cheers,</p>
            <p className="text-gray-800 font-medium">EzySkill Team</p>
          </div>

          {/* Attachment Notice */}
          <div className="pt-6 border-t border-gray-200">
            <p className="text-gray-700 font-medium">
              Please fond the attachment below
            </p>
          </div>

          {/* Footer Information */}
          <div className="pt-8 space-y-4 text-sm text-gray-600">
            <p>
              This email was sent to{" "}
              <a
                href={`mailto:${userEmail}`}
                className="text-[#FF6B35] hover:underline"
              >
                {userEmail}
              </a>
              . If you'd rather not receive this kind of email, you can{" "}
              <a
                href="#"
                className="text-[#FF6B35] hover:underline cursor-pointer"
              >
                unsubscribe or manage your email preferences
              </a>
              .
            </p>

            <p className="text-gray-600">
              Stripe, 510 Townsend Street, San Francisco CA 94103
            </p>
          </div>

          {/* Logo and Social Icons */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <img src="/logo.svg" alt="EZY Skills" className="h-10" />

            <div className="flex gap-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FF6B35] hover:text-[#e55a2a] transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FF6B35] hover:text-[#e55a2a] transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FF6B35] hover:text-[#e55a2a] transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailTemplate;
