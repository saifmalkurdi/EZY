function CurriculumForm({
  courseEnquiry = "Core UI",
  userName = "Avinash",
  phoneNumber = "9876543210",
  emailId = "Avinash25@gmail.com",
  description = "Lorem ipsum dolor sit amet consectetur adipiscing elit pellentesque vel, quis aenean aliquet mollis dignissim orci urna habitant mus.",
}) {
  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-[#003D7A] px-8 py-10 relative">
        {/* Logo */}
        <div className="absolute top-6 right-8">
          <img src="/logo-white.svg" alt="EZY Skills" className="h-12" />
        </div>

        <h1 className="text-3xl font-bold text-white">
          Curriculum <span className="text-[#FF6B35]">Form</span>
        </h1>
      </div>

      {/* Form Content */}
      <div className="p-8 space-y-6">
        {/* Course Enquiry */}
        <div className="border-b border-gray-200 pb-4">
          <label className="block text-sm font-semibold text-[#FF6B35] mb-2">
            Course Enquiry
          </label>
          <p className="text-gray-800 font-medium">{courseEnquiry}</p>
        </div>

        {/* User Name */}
        <div className="border-b border-gray-200 pb-4">
          <label className="block text-sm font-semibold text-[#FF6B35] mb-2">
            User Name
          </label>
          <p className="text-gray-800 font-medium">{userName}</p>
        </div>

        {/* Phone Number */}
        <div className="border-b border-gray-200 pb-4">
          <label className="block text-sm font-semibold text-[#FF6B35] mb-2">
            Phone Number
          </label>
          <p className="text-gray-800 font-medium">{phoneNumber}</p>
        </div>

        {/* Email ID */}
        <div className="border-b border-gray-200 pb-4">
          <label className="block text-sm font-semibold text-[#FF6B35] mb-2">
            Email ID
          </label>
          <p className="text-gray-800 font-medium">{emailId}</p>
        </div>

        {/* Description */}
        <div className="pb-4">
          <label className="block text-sm font-semibold text-[#FF6B35] mb-2">
            Description
          </label>
          <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        </div>

        {/* Attachment Notice */}
        <div className="pt-4">
          <p className="text-[#003D7A] font-bold text-lg">
            Please find the
            <br />
            attachment below
          </p>
        </div>
      </div>
    </div>
  );
}

export default CurriculumForm;
