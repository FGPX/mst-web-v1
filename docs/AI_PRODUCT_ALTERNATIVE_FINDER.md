# AI Product Alternative Finder

The shared **Discover More Like This** panel is available from Product Detail, Intelligent Search cards, Product Comparison, My Musterring and the Product Advisor.

Requests are validated by `alternativeRequestSchema`. `findGroundedAlternatives` compares only active catalogue products in the source category. Width, seat height, concept price, required/excluded functions, material tags, style and comfort are explicit checks. Exact results satisfy every check. Closest alternatives list every unmet requirement. Strict mode hides all non-exact alternatives.

Displayed Product IDs, names, dimensions and indicative prices are read from the catalogue. Material suitability is read from material metadata. Final price and availability remain retailer-confirmed.
