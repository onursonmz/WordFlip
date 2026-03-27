import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = (apiKey) => new GoogleGenerativeAI(apiKey);

export const fetchWordDetailsWithAI = async (word, apiKey) => {
  if (!apiKey) throw new Error("API Key eksik!");

  const model = genAI(apiKey).getGenerativeModel({ model: "gemini-2.5-flash" });

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
    const text = result.response.text();

    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');

    if (start === -1 || end === -1) {
      throw new Error("Yapay zeka uygun formatta yanıt veremedi.");
    }

    return JSON.parse(text.substring(start, end + 1));
  } catch (error) {
    console.error("AI Fetch Error:", error);
    
    // Eğer 404 hatasıysa list models yapıp hangi modellerin izni olduğunu gösterelim
    if (error.message && error.message.includes('404')) {
        try {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
            const data = await res.json();
            if (data.models) {
                const available = data.models.map(m => m.name.replace('models/', '')).filter(n => n.includes('gemini'));
                throw new Error(`Kullandığınız API Key'de "gemini-2.5-flash" bulunamadı. Kullanabileceğiniz modeller: ${available.join(', ')}. Lütfen yeni bir API Key aldığınızdan emin olun veya projenizi kontrol edin.`);
            } else if (data.error) {
                throw new Error(`API Key reddedildi: ${data.error.message}`);
            }
        } catch (fetchErr) {
            throw new Error(`Hata 404 alındı. Kullandığınız API anahtarı geçersiz veya kısıtlı bir projeye (örneğin Firebase yerine açılmış boş bir projeye) ait olabilir.`);
        }
    }

    throw new Error(error.message || "Yapay zeka detayları çekemedi. Bağlantınızı kontrol edin.");
  }
};
