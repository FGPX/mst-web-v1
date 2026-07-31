# Voice Interior Assistant

Voice entry points are present in the global header, floating assistant controls and Product Advisor. Browser speech recognition is used only after a user starts it. Unsupported or denied browsers retain typed command fallback.

Commands are converted to the validated `voiceCommandSchema`. Discovery/navigation commands may continue directly. Saves, material changes, complementary-product additions and consultation actions require a visible confirmation card. Voice never submits personal data or a retailer request.

States: idle, listening, processing, recognized, error and permission denied. Responses are always text; spoken feedback is optional and muted by default. Voice can be disabled.
