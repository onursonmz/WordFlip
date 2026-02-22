import { GoogleGenerativeAI } from "@google/generative-ai";

// Not: Güvenlik için API anahtarı normalde .env dosyasında saklanmalıdır.
// Kullanıcıya kendi anahtarını alabilmesi için bir alan sunacağız.
const genAI = (apiKey) => new GoogleGenerativeAI(apiKey);

export const fetchWordDetailsWithAI = async (word, apiKey) => {
    if (!apiKey) throw new Error("API Key eksik!");

    const model = genAI(apiKey).getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    Analyze the English word "${word}" and provide details for a flashcard application.
    Return ONLY a JSON object in the following format (no other text):
    {
      "englishWord": "${word}",
      "wordType": "noun OR verb OR adjective OR adverb OR phrase",
      "pronunciation": "phonetic spelling",
      "exampleSentenceEn": "one natural example sentence in English",
      "turkishMeaning": "short Turkish translation",
      "exampleSentenceTr": "Turkish translation of the example sentence"
    }
    Choose the most common usage of the word.
  `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // JSON içeriğini temizleyelim (bazı modeller ```json ... ``` içinde dönebiliyor)
        const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("AI Fetch Error:", error);
        throw new Error("Yapay zeka bilgileri getiremedi. Lütfen API anahtarınızı kontrol edin.");
    }
};
