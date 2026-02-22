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

    // Daha güvenli JSON ayıklama: İlk '{' ve son '}' karakterleri arasını al
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');

    if (start === -1 || end === -1) {
      console.error("Geçersiz AI yanıtı:", text);
      throw new Error("Yapay zeka uygun formatta yanıt veremedi.");
    }

    const jsonStr = text.substring(start, end + 1);
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("AI Fetch Error:", error);

    // Hata türüne göre kullanıcıya daha net bilgi verelim
    if (error.message?.includes("API_KEY_INVALID")) {
      throw new Error("Geçerli bir API anahtarı girmediniz.");
    }
    if (error.message?.includes("PERMISSION_DENIED")) {
      throw new Error("API anahtarınızın bu işlemi yapma yetkisi yok.");
    }
    if (error.message?.includes("quota")) {
      throw new Error("Ücretsiz API kotanız dolmuş olabilir.");
    }

    throw new Error("Yapay zeka bilgileri getiremedi. Lütfen internet bağlantınızı ve API anahtarınızı kontrol edin.");
  }
};
