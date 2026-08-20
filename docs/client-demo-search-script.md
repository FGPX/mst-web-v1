# Client demo: complex product search

The advisor uses OpenAI for structured intent extraction, then validates the request against catalogue facts. Some curated concept attributes demonstrate the future PIM-connected experience and are explicitly labelled in the UI.

## Recommended prompts

1. From JUSTB! PM200: `beige L sofa under 280 cm with modular fabric`
   - Expected verified exact match: JUSTB! PM100.
2. From JUSTB! PM100: `beige U shaped modular fabric sofa around 315 cm`
   - Expected verified exact match: JUSTB! PM200.
3. From JUSTB! PM200: `beige classic modern three-seat leather sofa under 250 cm with relax function`
   - Expected concept recommendation: MR 280, with illustrative-data disclosure.
4. From JUSTB! PM200: `find me a bleck sofa`
   - Expected typo recovery and verified exact match: MR 285.
5. From JUSTB! PM200: `red family sofa under 240 cm with relax function`
   - Expected concept recommendation: MR 260, with verified red presentation and disclosed illustrative style/function attributes.
6. From MR 710: `light grey straight three-seat fabric sofa under 240 cm wide with a modern comfort style and relax function`
   - Expected concept recommendation: MR 230, shown with its light-grey concept presentation.
7. From JUSTB! PM100: `black L-shaped three-seat leather sofa around 275 cm wide with a modern minimalist style and relax function`
   - Expected concept recommendation: MR 285, shown in its verified black presentation.
8. From JUSTB! PM100: `charcoal U-shaped four-seat modular leather sofa around 300 cm wide with electric recline and a minimal style`
   - Expected concept recommendation: MR 9450, shown with the generated charcoal concept presentation.

## Presenter language

“OpenAI interprets the customer’s natural-language request. The catalogue engine then checks every requirement. Green exact matches use verified connected facts; amber concept metadata demonstrates where richer PIM attributes will power the production experience. Configuration, fit and availability still require retailer confirmation.”

## Avoid claiming

- Concept dimensions or functions as final specifications.
- Current retailer availability.
- Physical room fit without the fit checker.
- A colour when the displayed catalogue image does not verify it.
