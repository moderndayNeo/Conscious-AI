import { encode, decode } from "gpt-3-encoder";

export function chunkByTokens(
	text: string,
	chunkSize: number = 500, // Good enough to retain semantic meaning of the text
	overlap: number = 50, // Enough overlap to retain context between chunks
): string[] {
	const tokens = encode(text);
	const chunks: string[] = [];

	let i = 0;
	while (i < tokens.length) {
		const chunkTokens = tokens.slice(i, i + chunkSize);
		const chunkText = decode(chunkTokens);
		chunks.push(chunkText);
		i += chunkSize - overlap; // Slide window forward with overlap
	}

	return chunks;
}

// Testing the function
// const longText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et vulputate arcu. Nam in feugiat lacus, ac sollicitudin ante. Praesent viverra luctus libero et rutrum. Suspendisse quis enim tincidunt, feugiat orci a, egestas tellus. Duis tortor turpis, aliquam aliquet nunc eu, pharetra malesuada risus. Integer vitae pellentesque odio. Proin convallis diam a tortor vulputate semper. Mauris quis mi ullamcorper, tristique eros in, molestie leo. Quisque aliquam odio eu nulla porta, at maximus lectus vehicula. Donec semper at velit nec auctor. Phasellus ultrices, velit vel pellentesque eleifend, justo justo malesuada massa, vitae pellentesque purus justo eu ligula. Nunc erat urna, rhoncus ac eros nec, consequat finibus velit. Nulla eget tortor nibh. Suspendisse in ante laoreet, fringilla nunc non, semper diam. Fusce sollicitudin quis libero non fermentum. Praesent vel lectus sem. Proin tincidunt, nulla quis efficitur auctor, risus orci venenatis orci, nec vehicula dolor orci in arcu. Phasellus tortor ligula, ornare viverra tempus ac, malesuada vestibulum ante. Sed rhoncus erat massa, a pulvinar orci fermentum et. Pellentesque quis venenatis mauris. Nullam eros erat, aliquet et lorem volutpat, tincidunt euismod ex. Proin at placerat lectus, ac facilisis massa. Praesent eleifend tortor enim, at efficitur purus suscipit ut. Cras hendrerit mi eget viverra faucibus. Cras aliquam hendrerit pellentesque. Suspendisse ullamcorper semper enim, eget maximus sem. Phasellus et tempor mi, commodo maximus quam. Quisque ultrices id magna a tempor. Vivamus vel aliquam metus, non vestibulum sapien. Nunc ex orci, auctor nec dolor non, dapibus egestas risus. Proin pretium sodales malesuada. Nunc est ligula, dictum in ultricies luctus, tristique ac nulla. Vestibulum a fringilla felis, ac luctus dui. Curabitur libero orci, dignissim ut lacinia ac, commodo eget arcu. Phasellus non velit ipsum. Nullam lacinia placerat dolor, quis convallis odio sagittis nec. Suspendisse potenti. Sed vitae mi nisi. Pellentesque eget semper nulla. Nunc ut euismod massa. Curabitur nisi nibh, dapibus tempus ligula elementum, lobortis sodales magna. Cras accumsan tristique quam. Suspendisse sodales, mi vel aliquet luctus, dui tortor rhoncus justo, id pretium dolor felis at quam. Pellentesque eu tellus et eros tempor egestas vitae sed magna. Maecenas egestas quis nulla nec accumsan. Proin facilisis at nunc eu maximus. Suspendisse ac vestibulum risus. Fusce ac ullamcorper massa. Maecenas vitae eros egestas, faucibus lectus sed, egestas tellus. Sed consectetur magna sed convallis tincidunt. In hac habitasse platea dictumst. Proin dapibus at risus ac iaculis. Curabitur tincidunt elit ut sem dapibus aliquet.`;
// const chunks = chunkByTokens(longText, 500, 50);
// console.log("Number of chunks:", chunks.length);
// console.log("First chunk:", chunks[0]);
