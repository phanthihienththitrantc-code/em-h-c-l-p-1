
import React from 'react';
import { BookOpen, PenTool, Sparkles, MessageCircle, Home, Image as ImageIcon, Film, Trophy, BarChart3, Heart, Gamepad2 } from 'lucide-react';
import { Lesson, WritingExercise, AppView, AppTheme, Exercise } from './types';

// Helper tạo bài tập trắc nghiệm nhanh
const createSelectionEx = (id: string, question: string, options: string[], correct: string): Exercise => ({
  id: `ex-${id}`,
  type: 'selection',
  question,
  options,
  correctAnswer: correct,
  expectedConcept: correct
});

// Helper tạo bài học chuẩn SGK
const createLesson = (id: string, title: string, page: number, vol: 1 | 2, sounds: string[], words: string[], paragraphs: string[]): Lesson => {
  return {
    id,
    title: `Bài ${id}: ${title}`,
    pageNumber: page,
    volume: vol,
    type: title.includes('Ôn tập') ? 'review' : 'alphabet',
    content: {
      sounds,
      words,
      paragraphs,
      exercises: [
        createSelectionEx(id, `Tiếng nào có chứa âm/vần "${sounds[0] || 'mới'}"?`, [...words, 'lá', 'me'].slice(0, 4), words[0] || words[1])
      ]
    }
  };
};

// --- DANH SÁCH BÀI HỌC TỔNG HỢP TỪ ẢNH SGK (TẬP 1 & TẬP 2) ---
export const LESSONS: Lesson[] = [
  // TẬP 1: Bài 1 - Bài 83 (Toàn bộ phần Âm và Vần)
  createLesson('1', 'a, b, c', 1, 1, ['a', 'b', 'c'], ['ba', 'bà', 'bá', 'ca', 'cá', 'cà'], ['bà ba, ba bà, ca ba, ba ba', '- A, ba ba!']),
  createLesson('4', 'e, ê', 1, 1, ['e', 'ê'], ['bé', 'bè', 'bê', 'bế'], ['be bé, bề bề, bế bé, bè bè', '- Cá be bé.', '- Bà bế bé']),
  createLesson('5', 'Ôn tập', 1, 1, [], ['ba bé', 'bà bè', 'bè cá'], ['- Bè be bé.', '- Bé bê ca.']),
  createLesson('6', 'o, ô, ?, .', 2, 1, ['o', 'ô'], ['cô', 'cố', 'cò', 'bố', 'bò', 'bổ', 'bộ'], ['bó cỏ, cổ cò, bò bê', '- Cô có cá, có cả cà', '- Bà bế bé, cô Ba bó cỏ.']),
  createLesson('8', 'd, đ', 2, 1, ['d', 'đ'], ['da', 'dạ', 'dế', 'đa', 'đá', 'đỏ', 'đò', 'đố'], ['ca đá, đa đa, da dẻ, da cá', '- Cô có ca đá.', '- bố đố bé']),
  createLesson('9', 'ơ, dấu ngã', 2, 1, ['ơ'], ['cờ', 'bơ', 'đỡ', 'cỡ', 'dỡ', 'cỗ', 'đỗ', 'bờ'], ['bờ cỏ, cờ đỏ, cá cờ', '- Bé có cờ đỏ.', '- Bò, bê ở bờ đê.']),
  createLesson('10', 'Ôn tập', 3, 1, [], ['Ô đỏ', 'đo đỏ', 'đỗ đỏ', 'dỗ bé'], ['- Ở bờ đê có dế.', '- Bé có bộ đồ đỏ, ô đỏ']),
  createLesson('11', 'i, k', 3, 1, ['i', 'k'], ['bi', 'bí', 'kè', 'kẽ', 'kí', 'kể', 'đi', 'dì'], ['đi đò, đá kì, bi bô, ê ke', 'kì cọ, đi bộ, kì đà, kề cà', '- Bé đi bộ ở bờ đê', '- Bố kê bể cá ở kệ']),
  createLesson('12', 'h, l', 3, 1, ['h', 'l'], ['hè', 'hề', 'lề', 'lè', 'hồ', 'lá', 'lò', 'hà'], ['lọ hồ, lá cọ, lễ độ, kì lạ,', 'hồ cá, ba lô, bó hẹ, lề hè', '- Bé có ba lô.', '- Bà có lá hẹ.', '- Bé bị ho, bà bế bé.']),
  createLesson('13', 'u, ư', 4, 1, ['u', 'ư'], ['cụ', 'dù', 'đủ', 'dữ', 'cũ', 'lũ', 'cử', 'bự'], ['đu đủ, cá dữ, cũ kĩ, bé bự', 'cù kì, cự li, bà cụ, ô dù', '- Bố bổ đu đủ', '- Ô bà đã cũ.']),
  createLesson('14', 'ch, kh', 4, 1, ['ch', 'kh'], ['chú', 'khá', 'chị', 'chữ', 'khó', 'chè', 'khỉ', 'khô'], ['chữ kí, cá kho, chả cá, khe đá', 'lá khô, chè kho, khe khẽ, chú khỉ', '- Bé đi khe khẽ', '- Kì đà bò ở khe đá']),
  createLesson('15', 'Ôn tập', 4, 1, [], ['kè đá', 'bó kê', 'chà là', 'chú hề'], ['kì cọ, bò kho, chở đò, ô li', '- Hà kẻ ô li.', '- Dì Lê đi chợ.', '- Bà có chè kho.', '- Bố chở bé đi Bờ Hồ', '- Bé bị ho, bà bế bé.']),
  createLesson('16', 'm, n', 5, 1, ['m', 'n'], ['mẹ', 'no', 'mè', 'mà', 'na', 'mơ', 'mỡ', 'nơ'], ['lọ mỡ, no nê, lá mơ, cá mè', 'nơ đỏ, bó mạ, lề mề, ca nô', '- Bé Chi có mũ nỉ đỏ.', '- Dì đi đò, bố mẹ đi ca nô.']),
  createLesson('17', 'g, gi', 5, 1, ['g', 'gi'], ['ga', 'gió', 'gà', 'giá', 'gỗ', 'giỏ', 'gia', 'già'], ['gà mẹ, giò chả, giá đỗ, gia vị', 'gỗ gụ, dự giờ, gõ mõ, giỏ cá', '- Dì Na ủ giá đỗ.', '- Mẹ gỡ cá cho bé.']),
  createLesson('18', 'gh, nh', 5, 1, ['gh', 'nh'], ['ghế', 'nho', 'nhớ', 'ghi', 'nhẹ', 'ghé', 'nhỉ', 'ghẹ'], ['ghè đá, nhà cổ, gồ ghề, nhỏ nhẹ,', 'ghi nhớ, nhỏ bé, ghế gỗ, nho khô', '- Bé bê ghế cho mẹ.', '- Bà cho bé nho khô.']),
  createLesson('19', 'ng, ngh', 6, 1, ['ng', 'ngh'], ['nga', 'nghệ', 'ngã', 'nghỉ', 'ngô', 'nghe', 'ngủ'], ['lá ngô, củ nghệ, nghỉ lễ, ngã ba', 'nghỉ hè, cá ngừ, ngô nghê, đề nghị', '- Nhà bà ở ngõ nhỏ.', '- Nghỉ lễ nhà Nga đi hồ Ba Bể.']),
  createLesson('20', 'Ôn tập', 6, 1, [], ['nhà ga', 'ngõ nhỏ', 'giá đỡ', 'nhổ cỏ'], ['bố mẹ, nhà lá, nghé ọ, ghế đá', '- Nhà Hà ở chợ Mơ.', '- Bố chở bà đi nhà ga.', '- Ngõ nhà bà nho nhỏ.']),
  createLesson('21', 'r, s', 6, 1, ['r', 's'], ['sổ', 'số', 'rõ', 'rẽ', 'rể', 'sò', 'rễ', 'sợ'], ['bó rạ, lọ sứ, nở rộ, sơ mi', 'sĩ số, gà ri, ca sĩ, rễ đa', '- Cô Na cho bé quả sơ –ri đỏ.', '- Bà cho nhà bé sò, gà ri, su su.']),
  createLesson('22', 't, tr', 7, 1, ['t', 'tr'], ['tổ', 'to', 'trà', 'tủ', 'trí', 'tre', 'từ', 'trọ'], ['tổ cò, cá trê, củ từ, nhà trẻ,', 'tre ngà, tủ gỗ, trí nhớ, trà đá', '- Chị Nga tô lá cờ đỏ.', '- Ngõ nhỏ nhà bé có tre ngà.']),
  createLesson('23', 'th, ia', 7, 1, ['th', 'ia'], ['thơ ca', 'bia đá', 'thả cá', 'tía tô'], ['đỏ tía, sở thú, lá mía, thợ nề', '- Chú Tư là thợ mỏ.', '- Chị Nga có thìa, Hà có dĩa nhỏ.', 'Bố cho Hà ra hồ thả cá. Hà thỏ thẻ: “Hồ to bố nhỉ? Bố cho bé ra thả cá rô nhé!”']),
  createLesson('24', 'ua, ưa', 8, 1, ['ua', 'ưa'], ['dưa bở', 'mùa thu', 'cua cá', 'cửa sổ'], ['chú rùa, nô đùa, lửa đỏ, sữa chua', '- Mẹ ru bé ngủ trưa.', '- Gió lùa qua khe cửa sổ.', 'Bà đưa bé đi chợ. Ở chợ có đủ thứ: cua, cá, giò, chả… Bà mua cá để kho dưa chua.']),
  createLesson('25', 'Ôn tập', 8, 1, [], ['rùa bò', 'thú dữ', 'đũa cả', 'thi đua'], ['xưa kia, tò mò, gió mùa, trú mưa', '- Lá khế khẽ đu đưa.', '- Bố đưa cả nhà đi hồ Ba Bể.', '- Mẹ che ô cho em bé đỡ mưa.', 'Nhà bà có chú chó to. Chó ngủ ở hè đẻ giữ nhà. Hễ có gì lạ, chú sủa rõ to.']),
  createLesson('26', 'ph, qu', 9, 1, ['ph', 'qu'], ['cà phê', 'tổ quạ', 'đi phà'], ['chả quế, cá quả, phá cỗ', 'khu phố, quà quê, ngũ quả', '- Mẹ pha cà phê cho bố.', '- Hà mê chả quế, cá quả kho.', 'Bố mẹ cho Hà ra phố. Ở phố có sở thú, nhà ga, ô tô. Bố cho bé ghé Bờ Hồ mua tò he. Hễ có gì lạ, bé Hà chỉ trỏ: “A, lạ ghê bố nhỉ!”.']),
  createLesson('27', 'x, v', 9, 1, ['x', 'v'], ['võ sĩ', 'xe chỉ', 'xe lu', 'va li'], ['thợ xẻ, vở vẽ, lò xo, vỏ sò', '- Bố cổ vũ bé đi thi vẽ.', '- Chú tư chỉ cho bé vẽ chó xù.', '- Dì Na mua cho Hà va li nho nhỏ.', 'Mẹ chở chị Nga ra thị xã. Ở nhà có bà và bé Hà. Khi Hà nhớ mẹ, bà bế bé ra ngõ chờ mẹ về.']),
  createLesson('28', 'y', 10, 1, ['y'], ['y sĩ', 'ngụ ý', 'y tế', 'chú ý'], ['như ý, quý giá, ý tứ, sổ y bạ', '- Thu về, dã quỳ nở rộ.', '- Bé chú ý nghe bà kể.', '- Mẹ hà là y tá ở xã.', 'Bé bị ho. Bố bế bé ra nhà y tế xã. Cô y tá ghi sổ y bạ đưa cho bố.']),
  createLesson('30', 'Ôn tập', 10, 1, [], ['phở bò', 'quà quý', 'chia sẻ', 'vé xe'], ['vỗ về, xà cừ, ý chí, cua đá', '- Mẹ ru khe khẽ cho bé ngủ.', '- Đi qua ngõ nhỏ là về nhà bà.', '- Từ quê ra, bà có quà cho cả nhà.', 'Mẹ cho bé đi xe ô tô vè quê bà. Quê bà ở Phú Thọ, có chè và cọ. Lá cọ to như ô che. Quả cọ bà để kho cá.']),
  createLesson('31', 'an, ăn, ân', 11, 1, ['an', 'ăn', 'ân'], ['bản đồ', 'khăn rằn', 'sân nhà', 'bàn ghế'], ['nhà sàn, múa lân, thợ săn, ân cần', '- Chị Nga mê văn nghệ.', '- Bản nhỏ có nhà sàn gỗ.', '- Bé bị ngã, bà ân cần dỗ bé.', 'Bố cho bé đi sở thú. Sở thú có vô vàn thú quý như: hổ, sư tử, cò, khỉ… Bố chỉ cho bé thú quý: hà mã, kì đà… Bố dặn bé chớ gần thú dữ như: hổ, trăn và sư tử.']),
  createLesson('32', 'on, ôn, ơn', 12, 1, ['on', 'ôn', 'ơn'], ['con cò', 'cơn mưa', 'số bốn', 'nhớ ơn'], ['con chồn, ngọn tre, thôn bản, đơn ca', '- Con cò ở ngọn tre.', '- Nhà bà ở thôn bản nhỏ.', '- Bé lon ton ra ngõ đón mẹ.', 'Nghỉ lễ mẹ đưa Hà và chị Nga về bà. Nhà bà ở thôn bản nhỏ, xa thị trấn. Bà cho bé đủ thứ quà quê: giò, chả, quế,… bà còn cho chị Nga cả nón đan từ lá cọ.']),
  createLesson('33', 'en, ên, in, un', 13, 1, ['en', 'ên', 'in', 'un'], ['dế mèn', 'khăn len', 'đèn pin', 'con nhện'], ['số chín, bến đò, mưa phùn, nền nhà', '- Mẹ mê món bún cá.', '- Thôn bản đã lên đèn.', '- Bà bin rịn chia xa cả nhà để về quê.', 'Bố đi xa về. Hà lon ton ra ngõ đón bố. Bố bế Hà và hôn lên má bé. Bố kể: “Ở xa, bố nhớ Hà, nhớ mẹ và nhớ cả chú cún con”. Bố mua quà cho cả nhà. Bố mua cho mẹ ô nhỏ, mua cho Hà khăn len và mũ len đỏ.']),
  createLesson('34', 'am, ăm, âm', 14, 1, ['am', 'ăm', 'âm'], ['chè lam', 'mầm non', 'số năm', 'quả cam'], ['đầm sen, con tằm, cá trắm, củ sâm.', '- Con tằm nhả tơ.', '- Nấm rơm nhỏ mà bụ bẫm.', '- Chị Nga mê món chè lam bà làm.', 'Hè, cả nhà về quê. Qua ngã tư là ngõ nhỏ nhà bà. Bà đã làm sẵn món cá trắm kho và món chè lam để chờ cả nhà về ăn. Từ xa, Hà nhìn căn nhà đơn sơ mà đầm ấm. Bố nhìn Hà thì thầm: “Mẹ con đã lớn lên từ căn nhà đó”.']),
  createLesson('35', 'Ôn tập', 15, 1, [], ['nhà sàn', 'đĩa bún', 'ân cần', 'lúa non'], ['gắn bó, chăm chỉ, bến đò, đầm ấm', '- Lá cờ đỏ thắm bên nhà sàn.', '- Bàn ghế nhà bé làm từ tre ngà.', '- Chú cún con mon men đến bên bé.', 'Nghỉ lễ, mẹ cho Hà về quê thăm bà và bé Bin. Hà vừa về đến ngõ, bà và bé Bin đã ra đón. Bé Bin nhìn Hà, lon ton đến bên chị. Hà bế Bin và hôn lên má bé.']),
  createLesson('36', 'om, ôm, ơm', 16, 1, ['om', 'ôm', 'ơm'], ['con tôm', 'khóm tre', 'bơm xe', 'ấm nhôm'], ['nhóm bạn, thợ gốm, rơm rạ, chả cốm', '- Con gà nằm ở ổ rơm.', '- Ngõ nhỏ có khóm tre ngà.', '- Dì Lê cho bé giỏ chôm chôm.', 'Nghỉ hè, mẹ cho Hà và chị Nga về quê. Bà đưa Hà và chị nga đi chợ. Chợ quê có cá, tôm, gà và cả ngan nữa. Bà mua cá về làm món cá om dưa cho cả nhà.']),
  createLesson('37', 'em, êm, im, um', 17, 1, ['em', 'êm', 'im', 'um'], ['chả nem', 'đêm rằm', 'con chim', 'tôm hùm'], ['gỗ lim, chùm nho, tấm rèm, thềm nhà', '- Mẹ rán chả nem thơm quá.', '- Bà cho bé chum nho chín đỏ.', '- Chú cún nằm chễm chệ trên ghế đệm.', 'Chị Nga bị ốm, dì Na đến thăm. Dì mua cho chị chùm nho tím, quả cam tròn mũm mĩm, quả dưa lê thơm thơm và cả vỉ sữa chua nữa. Dì đến bên, ân cần sờ trán chị Nga. Nhìn dì, chị Nga tủm tỉm, thầm cảm ơn dì.']),
  createLesson('38', 'ai, ây, ay', 18, 1, ['ai', 'ây', 'ay'], ['quả vải', 'cỏ may', 'mái nhà', 'thợ xây'], ['máy sấy, nhảy dây, máy bay, trại hè', '- Năm nay, chị Nga đi dự trại hè.', '- Chị và bé nhảy dây ở sân nhà.', '- Cu Bin ngủ dậy, hai má đỏ hây hây.', 'Hôm nay, Hà và mẹ đến nhà trẻ đón cu Bin. Hà cầm thêm chùm vải cho em. Thấy chị và mẹ đến, Bin chạy ngay ra ôm chầm lấy mẹ. Mẹ bế em lên. Hà đưa cho em mấy quả vải chín đỏ. Bin cầm chùm vải trên tay cứ tủm tỉm mãi.']),
  createLesson('39', 'oi, ôi, ơi', 19, 1, ['oi', 'ôi', 'ơi'], ['sợi chỉ', 'đĩa xôi', 'gói quà', 'chim ngói'], ['thổi còi, đồ chơi, quả ổi, bơi lội', '- Con voi có cái vòi dài.', '- Chú bộ đội về thăm nhà.', '- Trời tối sầm, gió vù vù, mưa xối xả.', '- Mẹ mua cho bé bộ đồ chơi nhựa.', 'Gió từ tay mẹ', 'Ru bé ngủ say', 'Thay cho gió trời', 'Giữa trưa oi ả.']),
  createLesson('40', 'Ôn tập', 20, 1, [], ['chòm lá', 'chổi rơm', 'cốm mới', 'đám mây'], ['bơi lội, tem thư, nhà máy, con nhím', '- Đám mây trôi nhè nhẹ trên trời.', '- Trên vòm lá me, có tổ chim be bé.', '- Mấy bạn túm ba tụm bảy chơi nhảy dây.', 'Đêm qua, bé thấy bạn Hải lái máy bay đến đón đi chơi. Nhìn từ trên máy bay, bé thấy mây bay nhè nhẹ, thấy nhà cửa, cây cối um tùm. Khi bé vừa ngủ dậy, mẹ hỏi: “Đêm qua, bé cứ lẩm bẩm gì thế?”. Bé tủm tỉm và nghĩ: “À, thì ra là bé mơ!”.']),
  createLesson('41', 'ui, ưi', 21, 1, ['ui', 'ưi'], ['túi vải', 'gửi quà', 'cùi dừa', 'khe núi'], ['múi khế, thưa gửi, ngửi mùi, bó củi', '- Mẹ cặm cụi đan túi cho bé.', '- Cây tầm gửi ở trên than cây ổi.', 'Chị Nga đã đi Hội An gần năm rồi. Nhớ chị, Hà gửi thư tâm sự với chị. Hà kể cho chị nghe về cây lan đã ra lá mới; cây me um tùm ở ngõ giờ đã sai quả. Giá mà có chị ở nhà để chơi trốn tìm với Hà như ngày xưa nhỉ? Hà nghĩ, chị Nga nhận thư sẽ vui lắm.']),
  createLesson('42', 'ao, eo', 22, 1, ['ao', 'eo'], ['ngôi sao', 'chim sáo', 'véo von', 'kẹo kéo'], ['bé tẹo, áo phao, con mèo, bao gạo', '- Dãy phi lao reo rì rào.', '- Chú bộ đội có mũ tai bèo.', 'Chú mèo nhà Hà là mèo tam thể. Hà gọi nó là bé Bự vì nó mũm mĩm lắm. Bự hay leo trèo trên than cây ổi. Nó còn trốn ở gầm bàn đẻ Hà đi tìm. Hà chăm Bự lắm. Hà hay gọi Bự ra sân chơi, cho nó ăn cơm với cá. Hễ Hà chỗ nào là Bự theo chỗ đấy.']),
  createLesson('43', 'au, âu, êu', 23, 1, ['au', 'âu', 'êu'], ['cỏ lau', 'cây nêu', 'ga tàu', 'con sếu'], ['thêu thùa, bầu trời, sáu sậu, trầu cau', '- Sớm mai con tàu ra khơi.', '- Sáu sậu đậu trên ngọn tre.', '- Mẹ thêu đôi chim nhỏ trên khan tay', 'Chú mèo tam thể', 'Leo lên cây cau', 'Thấy dây trầu leo', 'Mèo ta khều khào', 'Gió thổi lao xao', 'Lá cây rì rào', 'Làm mèo ta sợ', 'Chạy ngay vào nhà.']),
  createLesson('44', 'iu, ưu', 24, 1, ['iu', 'ưu'], ['êm dịu', 'nghỉ hưu', 'bưu tá', 'líu lo'], ['nhỏ xíu, quả lựu, trĩu quả, ngải cứu.', '- Chú thỏ mưu trí cứu bạn.', '- Chim chào mào líu lo trên cây ổi.', 'Cây lựu nhà cô Tâm sai trĩu quả. Quả lựu to, tròn, màu đo đỏ như cái đèn. Khi Hà lên thủ đô, cô gửi cho bố mẹ Hà giỏ lựu đầy. Cầm giỏ lựu trên tay, Hà nói cảm ơn cô Tâm.']),
  createLesson('45', 'Ôn tập', 25, 1, [], ['bé xíu', 'gửi thư', 'kéo co', 'leo trèo'], ['lau sậy, chào mào, cần câu, sân khấu', '- Chào mào có áo màu nâu.', '- Chú bưu tá đưa bưu phẩm đến tận nhà.', '- Trên sân, hai đội chơi kéo co vui quá là vui.', 'Ngày lễ, mẹ cho Hà lên phố đi bộ. Ở phố có đầy trò chơi vui lắm. Chỗ này, mấy bạn nhỏ chơi kéo co, chỗ kia hai chị lớn chơi nhảy dây. Phía xa xa, mấy bạn trai chơi trò lái ô tô. Bên vỉa hè, có chú cầm cọ vẽ mấy bạn nhỏ. Hà chạy đến xem và nhờ chú vẽ cho cả hai mẹ con.']),
  createLesson('46', 'ac, ăc, âc', 26, 1, ['ac', 'ăc', 'âc'], ['nhạc sĩ', 'tắc kè', 'âm nhạc', 'xôi gấc'], ['con hạc, màu sắc, gió bấc, con vạc', '- Chú mèo ngủ ở bậc thềm.', '- Hà ghi nhớ lời nhắc của bố mẹ.', '- Ở Tam Đảo có Cầu Mây và Thác Bạc', 'Sau cơn mưa đầu mùa, gió bấc tràn về. Sớm ra, trời giá hơn hẳn. Mẹ dậy sớm, nấu xôi lạc cho cả nhà. Sau bữa ăn, mẹ lấy thêm áo ấm cho Hà và chị Nga. Hai chị em mặc áo ấm, rồi vui vẻ chạy ra sân nô đùa.']),
  createLesson('47', 'oc, ôc, uc, ưc', 27, 1, ['oc', 'ôc', 'uc', 'ưc'], ['quả cóc', 'gốc cây', 'cây trúc', 'lọ mực'], ['khúc gỗ, con ốc, học bài, lực sĩ', '- Chú sóc leo lên cây dẻ.', '- Con dốc ở bản vừa dài lại vừa cao.', '- Mùa thu, cúc nở rực rỡ cả góc phố.', 'Cứ mỗi độ thu về, mẹ lại mua cúc về cắm. Nhìn lọ cúc nở rực rỡ trên bàn, mẹ vui lắm. Mùa thu còn có cốm mới. Mẹ bày đĩa cốm lên bàn tay của bố. Bố bảo: “ Cốm mới thơm lắm!”. Nghe bố khen cốm mới, bé thử ngay rồi tấm tắc khen.']),
  createLesson('48', 'at, ăt, ât', 28, 1, ['at', 'ăt', 'ât'], ['gió mát', 'chủ nhật', 'hạt cát', 'thật thà'], ['cửa sắt, bát đũa , đôi mắt, bài hát', '- Trời mùa thu gió mát.', '- Bé tự giặt khăn mặt.', '- Mẹ kho cá với mật mía.', 'Sân nhà bà ở quê có giàn bí. Từ mặt đất, bí bò ra, phủ tràn từ giàn ra cả lan can sắt. Lá bí to, mặt lá như phủ phấn. Nụ bí nho nhỏ. Quả bí khi to thì vỏ nhạt dần. Hai bà cháu chăm sóc giàn bí rất cẩn thận.']),
  createLesson('49', 'ot, ôt, ơt', 29, 1, ['ot', 'ôt', 'ơt'], ['rau ngót', 'lá lốt', 'cái vợt', 'quả nhót'], ['quả ớt, nắn nót, sữa bột, giọt mưa', '- Sau bữa cơm, bé rót trà mời bố mẹ.', '- Thức ăn của thỏ là cà rốt.', '- Trời đã ngớt mưa, các bạn nhỏ ùa ra sân chơi.', 'Ngày nghỉ, mẹ làm bao món ngon cho cả nhà. Hà mê hai món tôm sú tẩm bột rán và chả lá lốt. Nhìn đĩa tôm vừa rán giòn trên đĩa, Hà ăn thử ngay. Chao ôi, vị ngọt đậm đà của tôm, vị giòn của bột rán làm bé cứ mê mãi. Bé thủ thỉ với mẹ: “Hôm sau mẹ lại làm món này nhé!”.']),
  createLesson('50', 'Ôn tập', 30, 1, [], ['quả gấc', 'cao tốc', 'cúc áo', 'thơm mát'], ['đốt lửa, bắt tay, vất vả, ngọt lịm', '- Ở bản, nhà cửa thưa thớt.', '- Lời ru của mẹ thật ngọt ngào.', '- Nhà nhà đều tất bật để đón Tết.', 'Chị Nga vừa đi hội trại về, vẻ mặt chị hớn hở lắm. Hà hỏi: “Chị có gì mà vui thế?”. Chị Nga ôm Hà kể: ”Ở hội trại có các trò chơi vui lắm. Nào là ô ăn quan, nào là kéo co và chơi nhảy dây nữa. Tối đến thầy cô và các bạn lại đốt lửa trại, ca hát, nhảy múa…”. Nghe chị kể, Hà thấy vui theo.']),
  createLesson('51', 'et, êt, it', 31, 1, ['et', 'êt', 'it'], ['đất sét', 'con vịt', 'ngày tết', 'con vẹt'], ['quay tít, dệt vải, nét chữ, ríu rít', '- Quả mít chín rất ngon.', '- Bố mẹ đưa bé đi chơi tết.', '- Nhà bạn Hải có chú vẹt hay nói.', 'Cái con chìa vôi', 'Đậu trên cây mít', 'Nó kêu ríu rít', 'Mít đã chín rồi.']),
  createLesson('52', 'ut, ưt', 32, 1, ['ut', 'ưt'], ['ông bụt', 'gạo lứt', 'bút chì', 'mứt dừa'], ['nút chai, day dứt, kim phút, kẹo mút', '- Cô cho bé bút chì màu.', '- Mẹ làm món mứt dừa non.', 'Ngày gần tết mẹ làm món mứt dừa và ô mai để bán. Mứt dừa mẹ làm có đủ vị: cà phê, dâu, ca cao… Còn ô mai thì có: sấu chua giòn, mận xào cay và ô mai mơ vị thơm thơm. Hà thử món nào món đấy đều rất ngon.']),
  createLesson('53', 'ap, ăp, âp', 33, 1, ['ap', 'ăp', 'âp'], ['xe đạp', 'bắp ngô', 'bài tập', 'cáp treo'], ['thắp đèn, múa sạp, tấp nập, ngăn nắp', '- Bố dạy bé tập đi xe đạp.', '- Mẹ mua cho em tập vở mới.', '- Bắp ngô có các hạt đều tăm tắp.', 'Mẹ mua cho Hà tập vở mới và bút chì để bé tô chữ. Ngày ngày, bé chăm chỉ tập tô. Hà cẩn thận, nắn nót các chữ cái và chữ số. Nét chữ của bé đều tăm tắp. Sau khi tô chữ, bé còn lấy bút sáp màu ra vẽ. Hà vẽ bố, vẽ mẹ và vẽ cả ngôi nhà ấm áp của bé.']),
  createLesson('54', 'op, ôp, ơp', 34, 1, ['op', 'ôp', 'ơp'], ['chóp núi', 'lốp xe', 'lớp học', 'hộp giấy'], ['tia chớp, góp sức, tốp ca, cá bớp', '- Bản em trên chóp núi.', '- Lớp học hôm nay vui quá.', '- Đàn cá cờ ngoi lên đớp mưa.', 'Cô sẻ nâu cử sơn ca đi thi văn nghệ. Khi đi thi, sơn ca hồi hộp lắm. Về nhà, sơn ca hỏi mẹ nên hát bài gì cho ý nghĩa. Nhờ mẹ góp ý, sơn ca sẽ hát bài hát ca ngợi thầy cô và lớp mầm non của cô sẻ nâu.']),
  createLesson('55', 'Ôn tập', 35, 1, [], ['dệt vải', 'múi mít', 'quét nhà', 'hộp bút'], ['bắp cải, tập vẽ, họp chợ, nứt nẻ', '- Mẹ bổ mít cho cả nhà ăn.', '- Bé hồi hộp đợi quà của bố.', '- Bàn học của em rất ngăn nắp.', 'Cháu đi mẫu giáo', 'Giờ đã lên ba', 'Lời cô dạy cháu', 'Cháu nhắc cả nhà', 'Nhắc mẹ, nhắc cha', 'Khi ăn chớ nói', 'Đưa tăm chớ vội', 'Phải cầm hai tay']),
  createLesson('56', 'ep, êp, ip, up', 36, 1, ['ep', 'êp', 'ip', 'up'], ['con tép', 'búp bê', 'bắt nhịp', 'xôi nếp'], ['giày dép, bếp ga, vải đẹp, túp lều', '- Mẹ thổi xôi nếp.', '- Bé xin phép mẹ đến nhà bạn chơi.', '- Nhân dịp năm mới, cả nhà về quê ăn tết.', 'Cá mè ăn nổi', 'Cá chép ăn chìm', 'Con tép lim dim', 'Bên chùm rễ cỏ', 'Con cua áo đỏ', 'Cắt cỏ trên bờ', 'Con cá múa cờ', 'Đẹp ơi là đẹp']),
  createLesson('57', 'anh, ênh, inh', 37, 1, ['anh', 'ênh', 'inh'], ['màu xanh', 'con kênh', 'máy tính', 'bức tranh'], ['lênh khênh, thành phố, cá kình, mái đình', '- Mái đình Trà Cổ rất cổ kính.', '- Bức tranh này vẽ cảnh Cửa Lò.', '- Ở khu vui chơi, các bé chơi bập bênh.', 'Quê nội Hải ở Bến Tre. Nơi ấy có dãy dừa xanh cao vút, nằm dọc bên cạnh kênh dài. Lá dừa vừa to vừa dài cứ lao xao khi gió thổi về. Các trái dừa trên cây tròn tròn y như một đàn lợn con nằm ngủ. Bắc qua con kênh là cây cầu khỉ làm từ tre. Mối lần về quê, đi qua cầu khỉ, Hải vừa thấy hồi hộp vừa thấy thú vị.']),
  createLesson('58', 'ach, êch, ich', 38, 1, ['ach', 'êch', 'ich'], ['con ếch', 'cá trích', 'túi xách', 'tờ lịch'], ['vách núi, cái phích, kênh rạch, bạc phếch', '- Ếch kêu ồm ộp..', '- Em giữ gìn sách vở sạch sẽ.', '- Chú chim chích bé nhỏ, xinh xinh.', 'Ếch xanh và dế nâu là bạn của nhau. Ếch xanh ở hồ sen, dế nâu ở bãi cỏ gần hồ. Nhà ếch xanh có hồ sen thơm mát, còn nhà dế thì có bãi cỏ xanh non. Ếch xanh và dế nâu hay ngồi trên một lá sen to để đi chu du khắp hồ. Hai bạn như hai du khách thích khám phá cảnh ở trên hồ.']),
  createLesson('59', 'ang, ăng, âng', 39, 1, ['ang', 'ăng', 'âng'], ['làng quê', 'vâng lời', 'bậc thang', 'búp măng'], ['nâng niu, cửa hàng, lẵng hoa, trang vở', '- Tháng ba, cây bàng thay áo mới', '- Trăng rằm soi sáng khắp thôn làng.', '- Bé nâng niu lật trang sách mới.', 'Tháng Ba, bố Hà bắt đầu gieo hạt gấc. Đến tháng Tư, bố làm giàn cho gấc bò lên. Sang tháng sau, lá gấc xanh phủ kín cả giàn. Trái gấc theo đó mà to dần lên. Ban đầu quả gấp be bé màu xanh. Khi chín, quả gấc màu đỏ sẫm, gai chi chít. Tháng Tám, bố thu lứa đầu để làm xôi gấc và dầu gấc.']),
  createLesson('60', 'Ôn tập', 40, 1, [], ['gác xép', 'sắp xếp', 'nhịp nhàng', 'màu vàng'], ['minh mẫn, sở thích, chênh chếch, thênh thang', '- Mẹ làm bánh nếp rất ngon.', '- Bà nội bé vẫn còn minh mẫn lắm.', '- Đêm về, nhìn ánh trăng vàng thật đẹp.', 'Trăng đêm thu thật sáng. Trăng tròn vành vạch làm sáng cả một góc sân nhà Minh. Nhờ ánh trăng, Minh thấy mọi vật như rõ mồn một. Đó là bụi tre rì rào khi gió hè thổi, là cái ghế đẩu bà hay ngồi để quạt cho Minh. Ngắm trăng, Minh lại nhớ bà, nhớ một thuở ấu thơ bên bà.']),
  createLesson('61', 'ong, ông, ung, ưng', 41, 1, ['ong', 'ông', 'ung', 'ưng'], ['con ong', 'lung linh', 'trứng gà', 'áo bông'], ['quả sung, dòng sông, quả bóng, khu rừng', '- Chú thỏ nhảy tung tăng trên thảm cỏ', '- Mưa tạnh, nắng bừng lên một góc trời.', '- Sau cơn mưa, cầu vồng bừng lên đủ bảy sắc màu.', 'Nhảy tanh tách', 'Là con tép sống', 'Tép trong quả bòng', 'Xếp hàng đi ngủ.', 'Mẹ bòng ấp ủ', 'Một đàn tép thơm', 'Đội đêm trăng tròn', 'Ùa ra phá cỗ.']),
  createLesson('62', 'iêc, iên, iêp', 42, 1, ['iêc', 'iên', 'iêp'], ['cá diếc', 'kiến lửa', 'thiệp mời', 'công việc'], ['rau riếp, rạp xiếc, bưu điện, nhiếp ảnh', '- Bố mẹ cho bé đi xem xiếc.', '- Mẹ nấu miếng ngan rất ngon.', '- Rau diếp cá có vị chua chua, thanh mát.', 'Bé chọn màu xanh', 'Vẽ đồng lúa biếc', 'Bé chọn màu xanh', 'Vẽ rừng trùng điệp.', 'Bé chọn màu đỏ', 'Vẽ màu mái ngói', 'Bé chọn màu đỏ', 'Vẽ ông mặt trời..']),
  createLesson('63', 'iêng, iêm, yêm', 43, 1, ['iêng', 'iêm', 'yêm'], ['lặng yên', 'hồng xiêm', 'cồng chiêng', 'kim tiêm'], ['que diêm, siêng năng, chim yến, củ riềng', '- Hồng xiêm chín ngọt lịm', '- Bản nhỏ yên vui, thanh bình.', '- Tiếng cồng chiêng rộn rã khắp bản làng.', 'Cây hồng xiêm ở nhà nội sai trĩu quả. Những quả hồng xiêm màu nâu thơm lừng cả một góc. Ngày ngày, gà mẹ siêng năng đưa đàn con đến kiếm ăn ở đó. Có mẹ ở bên, chúng yên tâm chạy nhảy. Chốc chốc, có chú chạy lại, nấp vào cánh mẹ để nũng nịu. Lúc ấy, gà mẹ lại ôm gà con vào đôi cánh cứng cáp của mình.']),
  createLesson('64', 'iêt, iêu, yêu', 44, 1, ['iêt', 'iêu', 'yêu'], ['thời tiết', 'yêu quý', 'vải thiều', 'biết ơn'], ['Việt Nam, chiều tối, đáng yêu, cánh diều', '- Thời tiết mùa thu thật mát mẻ.', '- Chiều hè, mẹ nấu canh riêu cua.', '- Thầy cô dạy bé biết kính yêu ông bà, cha mẹ.', 'Bé đi trong hàng cây', 'Chỉ thấy vòng lá biếc', 'Nhạc công vẫn mê say', 'Điệu bổng trầm tha thiết.', 'Ve ve ve ve ve….', 'Kéo dài ra mải miết', 'Lạ nhỉ, khúc nhạc hè', 'Ve học đâu không biết?']),
  createLesson('65', 'Ôn tập', 45, 1, [], ['cầu vồng', 'trong xanh', 'vui mừng', 'kính yêu'], ['củ gừng, bữa tiệc, nhiệt tình, thiếp mời', '- Cả lớp yên lặng nghe cô giảng bài', '- Quê Hà nằm trên dòng sông xanh biếc.', '- Bạn Hải rất nhiệt tình chỉ bảo bài cho các bạn.', 'Mùa đông đi qua, thỏ xám hội ngộ với ong vàng tại khu rừng nhỏ. Hai bạn mừng rỡ nắm tay, hỏi han nhau. Trên bãi cỏ non xanh, đôi bạn cùng nhau nhảy múa và ca hát. Tiếng hát của hai bạn vang xa làm cho mọi vật đều nghe thấy. Tất cả cùng đến chung vui và hát lên bài ca tạm biệt mùa đông.']),
  createLesson('66', 'iêt, iêu, yêu', 46, 1, ['iêt', 'iêu', 'yêu'], ['chú cuội', 'nhuộm vải', 'đuôi cá', 'cánh buồm'], ['tuổi thơ, ao chuôm, con muỗi, luộm thuộm', '- Những cánh buồm trắng hối hả chở cá về bờ.', '- Buổi học cuối năm, cô trao quà cho các bạn.', 'Muồm muỗm bay cao', 'Cào cào bay thấp', 'Chúng em đuổi bắt', 'Trên đồng cỏ xanh.']),
  createLesson('67', 'uôc, uôt', 47, 1, ['uôc', 'uôt'], ['vỉ thuốc', 'tuốt lúa', 'cuộc thi', 'lạnh buốt'], ['bó đuốc, trong suốt, cày cuốc, trắng muốt', '- Chú thỏ con có bộ lông trắng muốt.', '- Chim non dậy sớm để học thuộc bài.', 'Mùa đông, tiết trời lạnh buốt. Suốt mấy ngày liền, trời mưa gió, rét buốt. Những cành cây khẳng khiu, gầy guộc, bên hè phố đã trơ trụi hết lá. Đất khô trắng, những cơn gió vi vu thổi lăn những lá khô xào xạc.']),
  createLesson('68', 'uôn, uông', 48, 1, ['uôn', 'uông'], ['chuồn chuồn', 'mưa tuôn', 'rau muống', 'chuông gió'], ['cà cuống, buồn vui, cội nguồn, đồng ruộng', '- Chiếc chuông gió kêu leng keng.', '- Chú chuồn chuồn ớt mới đẹp làm.', 'Chú chuồn chuồn bay về đậu ở cành khế đầu nhà. Hà muốn bắt nó về chơi. Bé nhẹ nhàng lại gần cành cây. Thấy Hà, chú chuồn chuồn sợ cuống lên, bay đi bay lại, từ cành này sang cành kia. Cái đầu chú lúc lắc, hai mắt mở to, đảo láo liên']),
  createLesson('69', 'ươi , ươu', 49, 1, ['ươi', 'ươu'], ['quả bưởi', 'con hươu', 'nụ cười', 'nướu răng'], ['bầu rượu, tươi tốt, lò sưởi, chú khướu', '- Cu Bin có nụ cười rất đáng yêu.', '- Chú khướu có giọng hót rất hay.', 'Sáng nào em đến lớp', 'Cũng thấy cô đến rồi', 'Đáp lời: Chào cô ạ!', 'Cô mỉm cười thật tươi.']),
  createLesson('70', 'Ôn tập', 50, 1, [], ['buổi chiều', 'hươu sao', 'tươi cười', 'luống rau'], ['cánh buồm, buồn vui, cuồn cuộn, bạch tuộc', '- Làn gió biển thổi vào mát dượi.', '- Chuồn chuồn đậu ở cành cây.', '- Mưa xuống, tiết trời càng lạnh buốt.', 'Mùa đông, hươu cao cổ bị viêm họng. Các cô cậu bé kéo nhau đến thăm hươu. Ai cũng biết đau họng thì phải quàng khăn ấm. Với cái cổ dài thế kia, hươu cần phải có rất nhiều khăn. Vậy là các cậu bé, cô bé tháo ngay khăn của mình quàng vào cổ cho chú. Trên chiếc cổ dài của hươu bao nhiêu là khăn: Khăn len, khăn dạ, …. Hươu cao cổ cảm động lắm và thấy mùa đông không còn lạnh nữa.']),
  createLesson('71', 'ươc, ươt', 51, 1, ['ươc', 'ươt'], ['cầu trượt', 'thược dược', 'cái lược', 'óng mượt'], ['giấy ướt, bước đi, ước mơ, thướt tha', '- Đàn gà con có bộ lông vàng óng mượt.', '- Thược dược có nhiều màu sắc rực rỡ.', 'Hang dế ở quanh bãi và gần hồ ao. Chuồn chuồn hay đậu trên ngọn cỏ cao bên bờ nước. Bởi thế đã thành thói quen, chàng dế và chàng chuồn chuồn cứ mùa hè đến là gặp nhau ở bờ cỏ ướt, anh đậu ngọn, anh nằm đất.']),
  createLesson('72', 'ươm, ươp', 52, 1, ['ươm', 'ươp'], ['quả mướp', 'ướm thử', 'hạt cườm', 'ướp đá'], ['thanh gươm, cướp cờ, túi chườm, nườm nượp', '- Giàn mướp che mát cả hiên nhà.', '- Bươm bướm bay dập dờn quanh những luống cải vàng.', 'Ông trồng bên cạnh bờ ao', 'Một giàn mướp lạ.... Trái nào cũng to', 'Lá xanh biếc, nụ vàng mơ', 'Để lũ ong phải ngẩn ngơ thế nào.']),
  createLesson('74', 'oa, oe', 53, 1, ['oa', 'oe'], ['cái loa', 'tròn xoe', 'toa tàu', 'điều hoà'], ['sức khoẻ, pháo hoa, váy xoè, hoa hoè', '- Chú ong chăm chỉ tìm hoa lấy mật.', '- Vườn hoa đua nhau kheo sắc, toả hương thơm.', 'Cây bí con vươn vai một cái rồi đội đất ngoi lên. Đầu tiên là hai lá mầm xinh xắn xoà lên khỏi mặt đất. Ôi, thế giới mới đẹp làm sao! Những bông hoa rực rỡ đu đưa, khoe sắc dưới ánh nắng mặt trời. Đàn bướm xinh dập dờn bên muôn hoa.']),
  createLesson('75', 'Ôn tập', 54, 1, [], ['rước đèn', 'lướt ván', 'nụ hoa', 'con mương'], ['hạt cườm, khoé mắt, cháo lươn, xanh tươi', '- Mẹ xâu hạt cườm thành chiếc vòng xinh xắn.', '- Thược dược khoe sắc đỏ trong nắng mai.', '- Người đi trẩy hội chùa hương đông nườm nượp.', 'Những chú ve trên cây đã bắt đầu kêu. Mùa hè đến rồi! Hoa bìm bịp tím biếc, hoa hướng dương vàng rực, hoa lựu đỏ hoe. Sau cơn mưa, cầu vồng bảy sắc bắt đầu xuất hiện phía chân trời. Từng đám mây đỏ rực như lửa. Ruộng lúa vàng trĩu bông nhấp nhô theo chiều gió. Mùa hè thật vui và rực rỡ.']),
  createLesson('76', 'oan, oăn, oat, oăt', 55, 1, ['oan', 'oăn', 'oat', 'oăt'], ['vở toán', 'nhọn hoắt', 'hoạt bát', 'xoắn thừng'], ['thoăn thoắt, đoàn tàu, khoẻ khoắn, ngoan ngoãn', '- Đoàn tàu từ từ tiến vào sân ga.', '- Bé được cô giáo tặng phiếu bé ngoan.', '- Các chị, các cô gặt lúa nhanh thoăn thoắt.', 'Lớp học của cô sẻ nâu trên giàn mướp, cạnh một cái ao nhỏ. Học trò của cô nhiều lắm: ong bầu, ong mật, bướm vàng, bướm trắng… Ai cũng xinh đẹp, ngoan ngoãn. Ngày Tết thầy cô đã đến, các bạn rủ nhau tặng quà cho cô. Ong mật tặng cô một túi mật thơm ngon. Bướm vàng múa một điệu thật đẹp… Cô sẻ nâu cảm động lắm vì thấy học trò mình đoàn kết và giỏi giang.']),
  createLesson('77', 'oai, uê, uy', 56, 1, ['oai', 'uê', 'uy'], ['khoai tay', 'xum xuê', 'bà ngoại', 'chỉ huy'], ['vạn tuế, suy nghĩ, hoa huệ, quả xoài', '- Trong vườn xum xuê trái ngọt.', '- Trên quảng trường Ba Đình, Lăng Bác uy nghi mà gần gũi.', '- Khoai tay chiên là món ăn yêu thích của các bạn nhỏ.', 'a) Cứ mỗi độ thu sang', 'Hoa cúc lại nở vàng', 'Ngoài vườn hương thơm ngát', 'Ong bướm bay rộn ràng.', 'b) Hoa cà tim tím', 'Hoa huệ trắng tinh', 'Hoa xoài xinh xinh', 'Đua nhau cùng nở.']),
  createLesson('78', 'uân, uât', 57, 1, ['uân', 'uât'], ['mùa xuân', 'kỉ luật', 'tuân thủ', 'nghệ thuật'], ['khuân vác, sầm uất, hoà thuận, huân chương', '- Sắc xuân đã tràn về khắp các miền quê.', '- Thành phố Hồ Chí Minh đông đúc và sầm uất.', 'Mùa xuân đã về. Nắng xuân lan toả khắp vườn nhà. Xuân về, bao loài hoa khoe sắc. Sắc vàng của cây quất, cây mai, sắc đỏ thắm của hoa đào, sắc trắng tinh khiết của hoa mận… Muôn hoa mang sắc xuân về cho mọi người.']),
  createLesson('79', 'uyên, uyêt', 58, 1, ['uyên', 'uyêt'], ['quyển vở', 'sò huyết', 'kể chuyện', 'truyền thuyết'], ['chuyên cần, quyết tâm, chim khuyên, uyệt binh', '- Đỉnh núi phủ đầy tuyết trắng.', '- Chú chim khuyên nhỏ hót véo von trên cành.', 'Gà cồ đến lớp', 'Mải nói chuyện riêng', 'Cô giáo đã nhắc', 'Vẫn còn huyên thuyên', 'Học ẩu chóng quên', 'Nhớ nguyên một chữ', 'Sáng ra vươn cổ', '“ Ó o …ó o…”.']),
  createLesson('80', 'Ôn tập', 59, 1, [], ['thuỷ thủ', 'quê quán', 'thuyết phục', 'sao khuê'], ['tuần tra, tàu thuỷ, tập luyện, tuyệt vời', '- Sinh hoạt hè là hoạt động bổ ích cho học sinh.', '- Để giúp cơ thể khoẻ khoắn, cần chăm chỉ tập thê dục.', 'Bé Na bừng tỉnh khi tiếng gà gáy “Ò…ó…o”. Ông chuối tiêu đang chăm những quả chuối mật vàng. Bà hồng xiêm quanh năm cần mẫn với chiếc áo nâu bạc phếch. Các cô bướm chuẩn bị những chiếc áo vàng tươi như đi xem hội, chị hồng thật rực rỡ trong chiếc áo màu đỏ…. Tất cả đều chờ mùa thu tới để đón cô trăng xuống vui đêm Trung Thu.']),
  createLesson('81', 'Ôn tập', 60, 1, [], ['nghệ thuật', 'tuyệt vời'], ['Bé luyện viết chữ đẹp mỗi ngày.']),
  createLesson('82', 'Ôn tập tổng hợp', 61, 1, [], ['mùa xuân', 'rực rỡ'], ['Bầu trời ngày một thêm xanh. Nắng vàng ngày càng rực rỡ.']),
  createLesson('83', 'Đánh giá cuối kỳ', 62, 1, [], ['hoa giấy', 'đàn kiến'], ['Con kiến phát hiện mẩu bánh rơi. Nó bò quanh mẩu bánh.']),

  // TẬP 2: Bắt đầu từ các chủ đề đọc hiểu
  {
    id: 'T2-1-1',
    title: 'Chủ điểm 1 - Bài 1: Tôi là học sinh lớp 1',
    pageNumber: 4,
    volume: 2,
    type: 'story',
    content: {
      words: ['đồng phục', 'hãnh diện', 'truyện tranh', 'chững chạc'],
      paragraphs: ['Tôi tên là Nam, học sinh lớp 1A, Trường Tiểu học Lê Quý Đôn. Ngày đầu đi học, mặc bộ đồng phục của trường, tôi hãnh diện lắm.', 'Hồi đầu năm học, tôi mới học chữ cái. Thế mà bây giờ, tôi đã đọc được truyện tranh. Tôi còn biết làm toán nữa. Tôi có thêm nhiều bạn mới.', 'Ai cũng bảo từ khi đi học, tôi chững chạc hẳn lên.'],
      exercises: [createSelectionEx('T2-1-1', 'Bạn Nam học lớp mấy?', ['Lớp 1', 'Lớp 2', 'Lớp 3'], 'Lớp 1')]
    }
  },
  {
    id: 'T2-1-2',
    title: 'Chủ điểm 1 - Bài 2: Đôi tai xấu xí',
    pageNumber: 8,
    volume: 2,
    type: 'story',
    content: {
      words: ['quên khuấy', 'hoảng sợ', 'dỏng tai', 'tấm tắc'],
      paragraphs: ['Thỏ có đôi tai dài và to. Bị bạn bè chê, thỏ buồn lắm. Thỏ bố động viên: "Rồi con sẽ thấy tai mình rất đẹp".', 'Một lần, thỏ và các bạn đi chơi xa, quên khuấy đường về. Ai cũng hoảng sợ. Thỏ chợt dỏng tai: "Suỵt! Có tiếng bố tớ gọi". Cả nhóm đi theo hướng có tiếng gọi. Tất cả về được tới nhà. Các bạn tấm tắc khen tai thỏ thật tuyệt.', 'Từ đó, thỏ không còn buồn vì đôi tai nữa.'],
      exercises: [createSelectionEx('T2-1-2', 'Vì sao thỏ buồn?', ['Vì tai dài và to', 'Vì tai nhỏ', 'Vì tai ngắn'], 'Vì tai dài và to')]
    }
  },
  {
    id: 'T2-1-3',
    title: 'Chủ điểm 1 - Bài 3: Bạn của gió',
    pageNumber: 12,
    volume: 2,
    type: 'story',
    content: {
      paragraphs: ['Ai là bạn gió?', 'Mà gió đi tìm', 'Bay theo cánh chim', 'Lùa trong tán lá...', 'Gió nhớ bạn quá', 'Nên gõ cửa hoài', 'Đẩy sóng dâng cao', 'Thổi căng buồm lớn.', 'Khi gió đi vắng', 'Lá buồn lặng im', 'Vắng cả cánh chim', 'Chẳng ai gõ cửa.', 'Sóng ngủ trong nước', 'Buồm chẳng ra khơi', 'Ai gọi: Gió ơi', 'Trong vòm lá biếc.'],
      exercises: [createSelectionEx('T2-1-3', 'Ở khổ thơ thứ nhất, gió đã làm gì để tìm bạn?', ['Bay theo cánh chim, lùa trong tán lá', 'Ngủ trong nước', 'Chẳng ra khơi'], 'Bay theo cánh chim, lùa trong tán lá')]
    }
  },
  {
    id: 'T2-1-4',
    title: 'Chủ điểm 1 - Bài 4: Giải thưởng tình bạn',
    pageNumber: 14,
    volume: 2,
    type: 'story',
    content: {
      paragraphs: ['Nai và hoẵng tham dự một cuộc chạy đua. Trước vạch xuất phát, nai và hoẵng xoạc chân lấy đà. Sau khi trọng tài ra hiệu, hai bạn lao như tên bắn. Cả hai luôn ở vị trí dẫn đầu. Bỗng nhiên, hoẵng vấp phải một hòn đá rồi ngã oạch. Nai vội dừng lại, đỡ hoẵng đứng dậy.', 'Nai và hoẵng về đích cuối cùng. Nhưng cả hai đều được tặng giải thưởng tình bạn.'],
      exercises: [createSelectionEx('T2-1-4', 'Vì sao hoẵng bị ngã?', ['Vấp phải hòn đá', 'Bị nai xô ngã', 'Chạy quá nhanh'], 'Vấp phải hòn đá')]
    }
  },
  {
    id: 'T2-1-5',
    title: 'Chủ điểm 1 - Bài 5: Sinh nhật của voi con',
    pageNumber: 18,
    volume: 2,
    type: 'story',
    content: {
      paragraphs: ['Hôm nay là sinh nhật của voi con, nhưng nó bị ốm. Đang buồn bã, bỗng voi con nghe tiếng gọi. Thì ra các bạn đến chúc mừng sinh nhật voi. Thỏ trắng mang cà rốt. Gấu đen ngoạm nguyên một nải chuối. Khỉ vàng và sóc nâu tặng voi tiết mục "ngúc ngoắc đuôi". Vẹt mỏ khoằm thay mặt các bạn nói những lời chúc tốt đẹp.', 'Voi con vui ơi là vui. Nó huơ vòi mấy vòng để cảm ơn các bạn.'],
      exercises: [createSelectionEx('T2-1-5', 'Những bạn nào đến mừng sinh nhật voi con?', ['Thỏ trắng, gấu đen, khỉ vàng, sóc nâu, vẹt mỏ khoằm', 'Chỉ có thỏ trắng', 'Chỉ có gấu đen'], 'Thỏ trắng, gấu đen, khỉ vàng, sóc nâu, vẹt mỏ khoằm')]
    }
  },
  {
    id: 'T2-2-1',
    title: 'Chủ điểm 2 - Bài 1: Nụ hôn trên bàn tay',
    pageNumber: 24,
    volume: 2,
    type: 'story',
    content: {
      paragraphs: ['Ngày đầu đi học, Nam hồi hộp lắm. Mẹ nhẹ nhàng đặt một nụ hôn vào bàn tay Nam và dặn:', '– Mỗi khi lo lắng, con hãy áp bàn tay này lên má. Mẹ lúc nào cũng ở bên con.', 'Nam cảm thấy thật ấm áp. Cậu im lặng rồi đột nhiên mỉm cười:', '– Mẹ đưa tay cho con nào!', 'Nam đặt một nụ hôn vào bàn tay mẹ rồi thủ thỉ:', '– Bây giờ thì mẹ cũng có nụ hôn trên bàn tay rồi. Con yêu mẹ!', 'Nam chào mẹ và tung tăng bước vào lớp.'],
      exercises: [createSelectionEx('T2-2-1', 'Ngày đầu đi học, Nam thế nào?', ['Hồi hộp', 'Vui vẻ', 'Buồn bã'], 'Hồi hộp')]
    }
  },
  {
    id: 'T2-2-2',
    title: 'Chủ điểm 2 - Bài 2: Làm anh',
    pageNumber: 28,
    volume: 2,
    type: 'story',
    content: {
      paragraphs: ['Làm anh khó đấy', 'Phải đâu chuyện đùa', 'Với em gái bé', 'Phải "người lớn" cơ.', 'Khi em bé khóc', 'Anh phải dỗ dành', 'Nếu em bé ngã', 'Anh nâng dịu dàng.', 'Mẹ cho quà bánh', 'Chia em phần hơn', 'Có đồ chơi đẹp', 'Cũng nhường em luôn.', 'Làm anh thật khó', 'Nhưng mà thật vui', 'Ai yêu em bé', 'Thì làm được thôi.'],
      exercises: [createSelectionEx('T2-2-2', 'Làm anh thì cần làm những gì cho em?', ['Dỗ dành, nâng dịu dàng, chia quà bánh, nhường đồ chơi', 'Chỉ chơi cùng em', 'Chỉ nhường đồ chơi'], 'Dỗ dành, nâng dịu dàng, chia quà bánh, nhường đồ chơi')]
    }
  },
  {
    id: 'T2-2-3',
    title: 'Chủ điểm 2 - Bài 3: Cả nhà đi chơi núi',
    pageNumber: 30,
    volume: 2,
    type: 'story',
    content: {
      paragraphs: ['Bố mẹ cho Nam và Đức đi chơi núi. Hôm trước, mẹ thức khuya để chuẩn bị quần áo, thức ăn, nước uống và cả tuýp thuốc chống côn trùng.', 'Hôm sau, khi mặt trời lên, cả nhà đã tới chân núi. Nam và Đức thích thú, đuổi nhau huỳnh huỵch. Càng lên cao, đường càng dốc và khúc khuỷu, bố phải cõng Đức. Thỉnh thoảng, mẹ lau mồ hôi cho hai anh em.', 'Lúc lên đến đỉnh núi, hai anh em vui sướng hét vang.'],
      exercises: [createSelectionEx('T2-2-3', 'Nam và Đức được bố mẹ cho đi đâu?', ['Đi chơi núi', 'Đi tắm biển', 'Đi công viên'], 'Đi chơi núi')]
    }
  },
  {
    id: 'T2-2-4',
    title: 'Chủ điểm 2 - Bài 4: Quạt cho bà ngủ',
    pageNumber: 34,
    volume: 2,
    type: 'story',
    content: {
      paragraphs: ['Ơi chích choè ơi!', 'Chim đừng hót nữa,', 'Bà em ốm rồi,', 'Lặng cho bà ngủ.', 'Bàn tay bé nhỏ', 'Vẫy quạt thật đều', 'Ngấn nắng thiu thiu', 'Đậu trên tường trắng.', 'Căn nhà đã vắng', 'Cốc chén lặng im', 'Đôi mắt lim dim', 'Ngủ ngon bà nhé.', 'Hoa cam, hoa khế', 'Chín lặng trong vườn,', 'Bà mơ tay cháu', 'Quạt đầy hương thơm.'],
      exercises: [createSelectionEx('T2-2-4', 'Vì sao bạn nhỏ không muốn chích choè hót nữa?', ['Vì bà ốm, cần yên tĩnh để ngủ', 'Vì chim hót không hay', 'Vì bạn nhỏ đang học bài'], 'Vì bà ốm, cần yên tĩnh để ngủ')]
    }
  },
  {
    id: 'T2-2-5',
    title: 'Chủ điểm 2 - Bài 5: Bữa cơm gia đình',
    pageNumber: 36,
    volume: 2,
    type: 'story',
    content: {
      paragraphs: ['Thấy mẹ đi chợ về, Chi hỏi:', '– Sao mẹ mua nhiều đồ ăn thế ạ?', '– Đố con hôm nay là ngày gì?', 'Chi chạy lại xem lịch:', '– A, ngày 28 tháng 6, Ngày Gia đình Việt Nam.', '– Đúng rồi. Vì thế, hôm nay nhà mình liên hoan con ạ.', 'Chi vui lắm. Em nhặt rau giúp mẹ. Bố dọn nhà, rửa xoong nồi, cốc chén. Ông bà trông em bé để mẹ nấu ăn. Cả nhà quây quần bên nhau. Bữa cơm thật tuyệt. Chi thích ngày nào cũng là Ngày Gia đình Việt Nam.'],
      exercises: [createSelectionEx('T2-2-5', 'Ngày Gia đình Việt Nam là ngày nào?', ['Ngày 28 tháng 6', 'Ngày 1 tháng 6', 'Ngày 8 tháng 3'], 'Ngày 28 tháng 6')]
    }
  },
  {
    id: 'T2-2-6',
    title: 'Chủ điểm 2 - Bài 6: Ngôi nhà',
    pageNumber: 40,
    volume: 2,
    type: 'story',
    content: {
      paragraphs: ['Em yêu nhà em', 'Hàng xoan trước ngõ', 'Hoa xao xuyến nở', 'Như mây từng chùm.', 'Em yêu tiếng chim', 'Đầu hồi lảnh lót', 'Mái vàng thơm phức', 'Rạ đầy sân phơi.', 'Em yêu ngôi nhà', 'Gỗ, tre mộc mạc', 'Như yêu đất nước', 'Bốn mùa chim ca.'],
      exercises: [createSelectionEx('T2-2-6', 'Trước ngõ nhà của bạn nhỏ có gì?', ['Hàng xoan', 'Cây bàng', 'Cây phượng'], 'Hàng xoan')]
    }
  },
  {
    id: 'T2-3-1',
    title: 'Chủ điểm 3 - Bài 1: Tôi đi học',
    pageNumber: 44,
    volume: 2,
    type: 'story',
    content: {
      paragraphs: ['Một buổi mai, mẹ âu yếm nắm tay tôi dẫn đi trên con đường làng dài và hẹp. Con đường này tôi đã đi lại nhiều lần, nhưng lần này tự nhiên thấy lạ. Cảnh vật xung quanh tôi đều thay đổi. Hôm nay tôi đi học.', 'Cũng như tôi, mấy cậu học trò mới bỡ ngỡ đứng nép bên người thân. Thầy giáo trẻ, gương mặt hiền từ, đón chúng tôi vào lớp. Tôi nhìn bàn ghế chỗ tôi ngồi rồi nhận là vật riêng của mình. Tôi nhìn bạn ngồi bên, người bạn chưa quen biết, nhưng không thấy xa lạ chút nào.'],
      exercises: [createSelectionEx('T2-3-1', 'Ngày đầu đi học, bạn nhỏ thấy cảnh vật xung quanh ra sao?', ['Đều thay đổi', 'Vẫn như cũ', 'Rất quen thuộc'], 'Đều thay đổi')]
    }
  },
  {
    id: 'T2-3-2',
    title: 'Chủ điểm 3 - Bài 2: Đi học',
    pageNumber: 48,
    volume: 2,
    type: 'story',
    content: {
      paragraphs: ['Hôm qua em tới trường', 'Mẹ dắt tay từng bước', 'Hôm nay mẹ lên nương', 'Một mình em tới lớp.', 'Trường của em be bé', 'Nằm lặng giữa rừng cây', 'Cô giáo em tre trẻ', 'Dạy em hát rất hay.', 'Hương rừng thơm đồi vắng', 'Nước suối trong thầm thì...', 'Cọ xoè ô che nắng', 'Râm mát đường em đi.'],
      exercises: [createSelectionEx('T2-3-2', 'Vì sao hôm nay bạn nhỏ đi học một mình?', ['Vì mẹ lên nương', 'Vì bạn nhỏ thích đi một mình', 'Vì trường ở gần nhà'], 'Vì mẹ lên nương')]
    }
  },
  {
    id: 'T2-3-3',
    title: 'Chủ điểm 3 - Bài 3: Hoa yêu thương',
    pageNumber: 50,
    volume: 2,
    type: 'story',
    content: {
      paragraphs: ['Hôm nay cô giáo cho lớp vẽ những gì yêu thích. Tuệ An hí hoáy vẽ siêu nhân áo đỏ, thắt lưng vàng. Gia Huy say sưa vẽ mèo máy, tỉ mỉ tô cái ria cong cong.', 'Cuối giờ, chúng tôi mang tranh đính lên bảng. Mọi ánh mắt đều hướng về bức tranh bông hoa bốn cánh của Hà.', 'Trên mỗi cánh hoa ghi tên một tổ trong lớp. Giữa nhụy hoa là cô giáo cười rất tươi. Bên dưới có dòng chữ nắn nót "Hoa yêu thương". Ai cũng thấy có mình trong tranh. Chúng tôi treo bức tranh ở góc sáng tạo của lớp.'],
      exercises: [createSelectionEx('T2-3-3', 'Bức tranh bông hoa bốn cánh được đặt tên là gì?', ['Hoa yêu thương', 'Hoa điểm mười', 'Hoa mặt trời'], 'Hoa yêu thương')]
    }
  },
  {
    id: 'T2-3-4',
    title: 'Chủ điểm 3 - Bài 4: Cây bàng và lớp học',
    pageNumber: 54,
    volume: 2,
    type: 'story',
    content: {
      paragraphs: ['Bên cửa lớp học', 'Có cây bàng già', 'Tán lá xoè ra', 'Như ô xanh mướt.', 'Bàng ghé cửa lớp', 'Nghe cô giảng bài', 'Mỗi buổi sớm mai', 'Quên ngày mưa nắng.', 'Cuối tuần, lớp vắng', 'Không thấy tiếng cô', 'Không bạn vui đùa', 'Tán bàng ngơ ngác.', 'Thứ hai trở lại', 'Lớp học tưng bừng', 'Tán xanh vui mừng', 'Vẫy chào các bạn.'],
      exercises: [createSelectionEx('T2-3-4', 'Trong khổ thơ đầu, cây bàng như thế nào?', ['Tán lá xoè ra như ô xanh mướt', 'Trụi lá', 'Đang ra hoa'], 'Tán lá xoè ra như ô xanh mướt')]
    }
  },
  {
    id: 'T2-3-5',
    title: 'Chủ điểm 3 - Bài 5: Bác trống trường',
    pageNumber: 56,
    volume: 2,
    type: 'story',
    content: {
      paragraphs: ['Tôi là trống trường. Thân hình tôi đẫy đà, nước da nâu bóng. Học trò thường gọi tôi là bác trống. Có lẽ vì các bạn thấy tôi ở trường lâu lắm rồi. Chính tôi cũng không biết mình đến đây từ bao giờ.', 'Hằng ngày, tôi giúp học trò ra vào lớp đúng giờ. Ngày khai trường, tiếng của tôi dõng dạc "tùng... tùng... tùng...", báo hiệu một năm học mới.', 'Bây giờ có thêm anh chuông điện, thỉnh thoảng cũng "reng... reng... reng..." báo giờ học. Nhưng tôi vẫn là người bạn thân thiết của các cô cậu học trò.'],
      exercises: [createSelectionEx('T2-3-5', 'Hằng ngày, trống trường giúp học sinh việc gì?', ['Ra vào lớp đúng giờ', 'Hát hay hơn', 'Làm bài tập'], 'Ra vào lớp đúng giờ')]
    }
  },
  {
    id: 'T2-3-6',
    title: 'Chủ điểm 3 - Bài 6: Giờ ra chơi',
    pageNumber: 60,
    volume: 2,
    type: 'story',
    content: {
      paragraphs: ['Trống báo giờ ra chơi', 'Từng đàn chim áo trắng', 'Xếp sách vở mau thôi', 'Ùa ra ngoài sân nắng.', 'Chỗ này đây, bạn gái', 'Vui nhảy dây nhịp nhàng', 'Vòng quay đều êm ái', 'Rộn tiếng cười hoà vang.', 'Đằng kia, ấy bạn trai', 'Đá cầu bay vun vút', 'Đôi chân móc rất tài', 'Tung nắng hồng lên ngực.', 'Giờ chơi vừa chấm dứt', 'Đàn chim non vội vàng', 'Xếp hàng nhanh vào lớp', 'Bài học mới sang trang.'],
      exercises: [createSelectionEx('T2-3-6', 'Những trò chơi nào được nói tới trong bài?', ['Nhảy dây, đá cầu', 'Bắn bi, trốn tìm', 'Kéo co, ô ăn quan'], 'Nhảy dây, đá cầu')]
    }
  },
  {
    id: 'T2-4-1',
    title: 'Chủ điểm 4 - Bài 1: Rửa tay trước khi ăn',
    pageNumber: 64,
    volume: 2,
    type: 'story',
    content: {
      paragraphs: ['Vi trùng có ở khắp nơi. Nhưng chúng ta không nhìn thấy được bằng mắt thường. Khi tay tiếp xúc với đồ vật, vi trùng dính vào tay.', 'Tay cầm thức ăn, vi trùng từ tay theo thức ăn đi vào cơ thể. Do đó, chúng ta có thể mắc bệnh.', 'Để phòng bệnh, chúng ta phải rửa tay trước khi ăn. Cần rửa tay bằng xà phòng với nước sạch.'],
      exercises: [createSelectionEx('T2-4-1', 'Vi trùng đi vào cơ thể con người bằng cách nào?', ['Từ tay theo thức ăn đi vào cơ thể', 'Qua đường hô hấp', 'Qua da'], 'Từ tay theo thức ăn đi vào cơ thể')]
    }
  },
  {
    id: 'T2-4-2',
    title: 'Chủ điểm 4 - Bài 2: Lời chào',
    pageNumber: 68,
    volume: 2,
    type: 'story',
    content: {
      paragraphs: ['Đi đến nơi nào', 'Lời chào đi trước', 'Lời chào dẫn bước', 'Chẳng sợ lạc nhà', 'Lời chào kết bạn', 'Con đường bớt xa', 'Lời chào là hoa', 'Nở từ lòng tốt', 'Là cơn gió mát', 'Buổi sáng đầu ngày', 'Như một bàn tay', 'Chân thành cởi mở', 'Ai ai cũng có', 'Chẳng nặng là bao', 'Bạn ơi đi đâu', 'Nhớ mang đi nhé.'],
      exercises: [createSelectionEx('T2-4-2', 'Lời chào được so sánh với những gì?', ['Hoa, cơn gió mát, bàn tay', 'Mặt trời, mặt trăng, ngôi sao', 'Dòng sông, ngọn núi, cánh đồng'], 'Hoa, cơn gió mát, bàn tay')]
    }
  },
  {
    id: 'T2-4-3',
    title: 'Chủ điểm 4 - Bài 3: Khi mẹ vắng nhà',
    pageNumber: 70,
    volume: 2,
    type: 'story',
    content: {
      paragraphs: ['Trong khu rừng nọ có một đàn dê con sống cùng mẹ. Một hôm, trước khi đi kiếm cỏ, dê mẹ dặn con:', '– Ai đến gọi cửa, các con đừng mở nhé! Chỉ mở cửa khi nghe tiếng mẹ.', 'Một con sói nấp gần đó. Đợi dê mẹ đi xa, nó gõ cửa và giả giọng dê mẹ.', 'Nhớ lời mẹ, đàn dê con nói:', '– Không phải giọng mẹ. Không mở.', 'Sói đành bỏ đi.', 'Một lúc sau, dê mẹ về. Nghe đúng tiếng mẹ, đàn dê con ra mở cửa và tíu tít khoe:', '– Lúc mẹ đi vắng, có tiếng gọi cửa, nhưng không phải giọng của mẹ nên chúng con không mở.', 'Dê mẹ xoa đầu đàn con:', '– Các con ngoan lắm!'],
      exercises: [createSelectionEx('T2-4-3', 'Dê mẹ dặn dê con chỉ được mở cửa khi nào?', ['Khi nghe tiếng mẹ', 'Khi nghe tiếng gõ cửa', 'Khi có người quen đến'], 'Khi nghe tiếng mẹ')]
    }
  },
  {
    id: 'T2-4-4',
    title: 'Chủ điểm 4 - Bài 4: Nếu không may bị lạc',
    pageNumber: 74,
    volume: 2,
    type: 'story',
    content: {
      paragraphs: ['Sáng chủ nhật, bố cho Nam và em đi công viên. Công viên đông như hội. Khi vào cổng, bố dặn: "Các con cẩn thận kẻo bị lạc. Nếu không may bị lạc, các con nhớ đi ra cổng này. Nhìn kìa, trên cổng có lá cờ rất to".', 'Công viên đẹp quá. Nam cứ mải mê xem hết chỗ này đến chỗ khác. Lúc ngoảnh lại thì không thấy bố và em đâu. Nam vừa chạy tìm vừa gọi "Bố ơi! Bố ơi!". Hoảng hốt, Nam suýt khóc. Chợt Nam nhìn thấy tấm biển "Lối ra cổng". Nhớ lời bố dặn, Nam đi theo hướng tấm biển chỉ đường. "A, lá cờ kia rồi!". Nam mừng rỡ khi thấy bố và em đang chờ ở đó.'],
      exercises: [createSelectionEx('T2-4-4', 'Khi vào cổng, bố dặn hai anh em Nam thế nào?', ['Nếu bị lạc, nhớ đi ra cổng có lá cờ rất to', 'Không được đi chơi xa', 'Phải nắm tay nhau'], 'Nếu bị lạc, nhớ đi ra cổng có lá cờ rất to')]
    }
  },
  {
    id: 'T2-4-5',
    title: 'Chủ điểm 4 - Bài 5: Đèn giao thông',
    pageNumber: 78,
    volume: 2,
    type: 'story',
    content: {
      paragraphs: ['Ở các ngã ba, ngã tư đường phố thường có cây đèn ba màu: đỏ, vàng, xanh. Đèn đỏ báo hiệu người đi đường và các phương tiện giao thông phải dừng lại. Đèn xanh báo hiệu được phép di chuyển. Còn đèn vàng báo hiệu phải đi chậm lại trước khi dừng hẳn.', 'Cây đèn ba màu này được gọi là đèn giao thông. Nó điều khiển việc đi lại trên đường phố. Nếu không có đèn giao thông thì việc đi lại sẽ rất lộn xộn và nguy hiểm.', 'Tuân thủ sự điều khiển của đèn giao thông giúp chúng ta bảo đảm an toàn khi đi lại.'],
      exercises: [createSelectionEx('T2-4-5', 'Đèn giao thông có mấy màu?', ['3 màu: đỏ, vàng, xanh', '2 màu: đỏ, xanh', '4 màu: đỏ, vàng, xanh, trắng'], '3 màu: đỏ, vàng, xanh')]
    }
  },
  {
    id: 'T2-5-1',
    title: 'Chủ điểm 5 - Bài 1: Kiến và chim bồ câu',
    pageNumber: 84,
    volume: 2,
    type: 'story',
    content: {
      paragraphs: ['Một con kiến không may bị rơi xuống nước. Nó vùng vẫy và la lên:', '– Cứu tôi với, cứu tôi với!', 'Nghe tiếng kêu cứu của kiến, bồ câu nhanh trí nhặt một chiếc lá thả xuống nước. Kiến bám vào chiếc lá và leo được lên bờ.', 'Một hôm, kiến thấy người thợ săn đang ngắm bắn bồ câu. Ngay lập tức, nó bò đến, cắn vào chân anh ta. Người thợ săn giật mình. Bồ câu thấy động liền bay đi.', 'Bồ câu tìm đến chỗ kiến, cảm động nói:', '– Cảm ơn cậu đã cứu tớ.', 'Kiến đáp:', '– Cậu cũng giúp tớ thoát chết mà.', 'Cả hai đều rất vui vì đã giúp nhau.'],
      exercises: [createSelectionEx('T2-5-1', 'Bồ câu đã làm gì để cứu kiến?', ['Nhặt một chiếc lá thả xuống nước', 'Bay xuống vớt kiến lên', 'Gọi các bạn đến cứu'], 'Nhặt một chiếc lá thả xuống nước')]
    }
  },
  {
    id: 'T2-5-2',
    title: 'Chủ điểm 5 - Bài 2: Câu chuyện của rễ',
    pageNumber: 88,
    volume: 2,
    type: 'story',
    content: {
      paragraphs: ['Hoa nở trên cành', 'Khoe muôn sắc thắm', 'Giữa vòm lá xanh', 'Toả hương trong nắng.', 'Để hoa nở đẹp', 'Để quả trĩu cành', 'Để lá biếc xanh', 'Rễ chìm trong đất...', 'Nếu không có rễ', 'Cây chẳng đâm chồi', 'Chẳng ra trái ngọt', 'Chẳng nở hoa tươi.', 'Rễ chẳng nhiều lời', 'Âm thầm, nhỏ bé', 'Làm đẹp cho đời', 'Khiêm nhường, lặng lẽ.'],
      exercises: [createSelectionEx('T2-5-2', 'Nhờ có rễ mà hoa, quả, lá như thế nào?', ['Hoa nở đẹp, quả trĩu cành, lá biếc xanh', 'Cây mau lớn', 'Cây không bị đổ'], 'Hoa nở đẹp, quả trĩu cành, lá biếc xanh')]
    }
  },
  {
    id: 'T2-5-3',
    title: 'Chủ điểm 5 - Bài 3: Câu hỏi của sói',
    pageNumber: 90,
    volume: 2,
    type: 'story',
    content: {
      paragraphs: ['Một chú sóc đang chuyền trên cành cây bỗng trượt chân, rơi trúng đầu lão sói đang ngái ngủ. Sói chồm dậy, túm lấy sóc. Sóc van nài:', '– Xin hãy thả tôi ra!', 'Sói nói:', '– Được, ta sẽ thả, nhưng ngươi hãy nói cho ta biết: Vì sao bọn sóc các ngươi cứ nhảy nhót vui đùa suốt ngày, còn ta lúc nào cũng thấy buồn bực?', 'Sóc bảo:', '– Thả tôi ra, rồi tôi sẽ nói.', 'Sói thả sóc ra. Sóc nhảy tót lên cây cao, rồi đáp vọng xuống:', '– Mỗi khi nhìn thấy anh, chúng tôi đều bỏ chạy vì anh hay gây gổ. Anh hay buồn bực vì anh không có bạn bè. Còn chúng tôi lúc nào cũng vui vì chúng tôi có nhiều bạn tốt.'],
      exercises: [createSelectionEx('T2-5-3', 'Vì sao sói lúc nào cũng cảm thấy buồn bực?', ['Vì sói hay gây gổ, không có bạn bè', 'Vì sói không biết nhảy nhót', 'Vì sói hay buồn ngủ'], 'Vì sói hay gây gổ, không có bạn bè')]
    }
  },
  {
    id: 'T2-5-4',
    title: 'Chủ điểm 5 - Bài 4: Chú bé chăn cừu',
    pageNumber: 94,
    volume: 2,
    type: 'story',
    content: {
      paragraphs: ['Có một chú bé chăn cừu thường thả cừu gần chân núi. Một hôm thấy buồn quá, chú nghĩ ra một trò đùa cho vui. Chú giả vờ kêu toáng lên:', '– Sói! Sói! Cứu tôi với!', 'Nghe tiếng kêu cứu, mấy bác nông dân đang làm việc gần đấy tức tốc chạy tới. Nhưng họ không thấy sói đâu. Thấy vậy, chú khoái chí lắm.', 'Mấy hôm sau, chú lại bày ra trò ấy. Các bác nông dân lại chạy tới. Rồi một hôm, sói đến thật. Chú hốt hoảng kêu gào xin cứu giúp. Các bác nông dân nghĩ là chú lại lừa mình, nên vẫn thản nhiên làm việc. Thế là sói thoả thuê ăn thịt hết cả đàn cừu.'],
      exercises: [createSelectionEx('T2-5-4', 'Ban đầu, nghe tiếng kêu cứu, mấy bác nông dân đã làm gì?', ['Tức tốc chạy tới', 'Không quan tâm', 'Báo cho người khác'], 'Tức tốc chạy tới')]
    }
  },
  {
    id: 'T2-5-5',
    title: 'Chủ điểm 5 - Bài 5: Tiếng vọng của núi',
    pageNumber: 98,
    volume: 2,
    type: 'story',
    content: {
      paragraphs: ['Đang đi chơi trong núi, gấu con chợt nhìn thấy một hạt dẻ. Gấu con vui mừng reo lên: "A!". Ngay lập tức, có tiếng "A!" vọng lại. Gấu con ngạc nhiên kêu to: "Bạn là ai?". Lại có tiếng vọng ra từ vách núi: "Bạn là ai?". Gấu con hét lên: "Sao không nói cho tôi biết?". Núi cũng đáp lại như vậy. Gấu con bực tức: "Tôi ghét bạn". Khắp nơi có tiếng vọng: "Tôi ghét bạn". Gấu con tủi thân, oà khóc.', 'Về nhà, gấu con kể cho mẹ nghe. Gấu mẹ cười bảo: "Con hãy quay lại và nói với núi: "Tôi yêu bạn". Gấu con làm theo lời mẹ. Quả nhiên, có tiếng vọng lại: "Tôi yêu bạn". Gấu con bật cười vui vẻ.'],
      exercises: [createSelectionEx('T2-5-5', 'Gấu mẹ nói gì với gấu con?', ['Con hãy quay lại và nói với núi: "Tôi yêu bạn"', 'Con đừng chơi ở núi nữa', 'Núi là người bạn tốt'], 'Con hãy quay lại và nói với núi: "Tôi yêu bạn"')]
    }
  },
  {
    id: 'T2-6-1',
    title: 'Chủ điểm 6 - Bài 1: Loài chim của biển cả',
    pageNumber: 104,
    volume: 2,
    type: 'story',
    content: {
      paragraphs: ['Hải âu là loài chim của biển cả. Chúng có sải cánh lớn, nên có thể bay rất xa, vượt qua cả những đại dương mênh mông. Hải âu còn bơi rất giỏi nhờ chân của chúng có màng như chân vịt.', 'Hải âu bay suốt ngày trên mặt biển. Đôi khi, chúng đậu ngay trên mặt nước dập dềnh. Khi trời sắp có bão, chúng bay thành đàn tìm nơi trú ẩn. Vì vậy, hải âu được gọi là loài chim báo bão. Chúng cũng được coi là bạn của những người đi biển.'],
      exercises: [createSelectionEx('T2-6-1', 'Vì sao hải âu được gọi là loài chim báo bão?', ['Vì khi trời sắp có bão, chúng bay thành đàn tìm nơi trú ẩn', 'Vì chúng bay rất nhanh', 'Vì chúng kêu rất to'], 'Vì khi trời sắp có bão, chúng bay thành đàn tìm nơi trú ẩn')]
    }
  },
  {
    id: 'T2-6-2',
    title: 'Chủ điểm 6 - Bài 2: Bảy sắc cầu vồng',
    pageNumber: 108,
    volume: 2,
    type: 'story',
    content: {
      paragraphs: ['Vừa mưa lại nắng', 'Hay có cầu vồng', 'Bảy màu tươi thắm', 'Bé mừng vui trông', 'Màu đỏ mặt trời', 'Màu cam đu đủ', 'Màu vàng cá bơi', 'Lục kia màu lá', 'Màu lam đám mây', 'Màu chàm áo mẹ', 'Màu tím hoa sim', 'Bảy màu yêu thế.', 'Cầu vồng ẩn hiện', 'Rồi lại tan mau', 'Đất trời bừng tỉnh', 'Sau cơn mưa rào.'],
      exercises: [createSelectionEx('T2-6-2', 'Cầu vồng thường xuất hiện khi nào?', ['Vừa mưa lại nắng', 'Trời đang mưa to', 'Trời nắng gắt'], 'Vừa mưa lại nắng')]
    }
  },
  {
    id: 'T2-6-3',
    title: 'Chủ điểm 6 - Bài 3: Chúa tể rừng xanh',
    pageNumber: 110,
    volume: 2,
    type: 'story',
    content: {
      paragraphs: ['Hổ là loài thú ăn thịt, sống trong rừng. Lông hổ thường có màu vàng, pha những vằn đen. Răng sắc nhọn, mắt nhìn rõ mọi vật trong đêm tối. Bốn chân chắc khoẻ và có vuốt sắc. Đuôi dài và cứng như roi sắt. Hổ di chuyển nhanh, có thể nhảy xa và săn mồi rất giỏi. Hổ rất khoẻ và hung dữ.', 'Hầu hết các con vật sống trong rừng đều sợ hổ. Vì vậy, hổ được xem là chúa tể rừng xanh.'],
      exercises: [createSelectionEx('T2-6-3', 'Hổ ăn gì và sống ở đâu?', ['Ăn thịt, sống trong rừng', 'Ăn cỏ, sống trên đồng cỏ', 'Ăn cá, sống dưới nước'], 'Ăn thịt, sống trong rừng')]
    }
  },
  {
    id: 'T2-6-4',
    title: 'Chủ điểm 6 - Bài 4: Cuộc thi tài năng rừng xanh',
    pageNumber: 114,
    volume: 2,
    type: 'story',
    content: {
      paragraphs: ['Mừng xuân, các con vật trong rừng tổ chức một cuộc thi tài năng. Đúng như chương trình đã niêm yết, cuộc thi mở đầu bằng tiết mục của chim yểng. Yểng nhoẻn miệng cười rồi bắt chước tiếng của một số loài vật. Tiếp theo là ca khúc "ngoao ngoao" của mèo rừng. Gõ kiến chỉ trong nháy mắt đã khoét được cái tổ xinh xắn. Chim công khiến khán giả say mê, choáng ngợp vì điệu múa tuyệt đẹp. Voọc xám với tiết mục đu cây điêu luyện làm tất cả trầm trồ thích thú.', 'Các con vật đều xứng đáng nhận phần thưởng.'],
      exercises: [createSelectionEx('T2-6-4', 'Cuộc thi có những con vật nào tham gia?', ['Chim yểng, mèo rừng, gõ kiến, chim công, voọc xám', 'Hổ, báo, sư tử', 'Khỉ, hươu, nai'], 'Chim yểng, mèo rừng, gõ kiến, chim công, voọc xám')]
    }
  },
  {
    id: 'T2-6-5',
    title: 'Chủ điểm 6 - Bài 5: Cây liễu dẻo dai',
    pageNumber: 118,
    volume: 2,
    type: 'story',
    content: {
      paragraphs: ['Trời nổi gió to. Cây liễu không ngừng lắc lư. Thấy vậy, Nam rất lo cây liễu sẽ bị gãy. Nam hỏi mẹ:', '– Mẹ ơi, cây liễu mềm yếu thế, liệu có bị gió làm gãy không ạ?', 'Mẹ mỉm cười đáp:', '– Con yên tâm, cây liễu sẽ không sao đâu!', 'Mẹ giải thích thêm:', '– Thân cây liễu tuy không to nhưng dẻo dai. Cành liễu mềm mại, có thể chuyển động theo chiều gió. Vì vậy, cây không dễ bị gãy. Liễu còn là loài cây dễ trồng. Chỉ cần cắm cành xuống đất, nó có thể nhanh chóng mọc lên cây non.'],
      exercises: [createSelectionEx('T2-6-5', 'Thân cây liễu có đặc điểm gì?', ['Không to nhưng dẻo dai', 'Rất to và cứng', 'Nhỏ và dễ gãy'], 'Không to nhưng dẻo dai')]
    }
  },
  {
    id: 'T2-7-1',
    title: 'Chủ điểm 7 - Bài 1: Tia nắng đi đâu?',
    pageNumber: 124,
    volume: 2,
    type: 'story',
    content: {
      paragraphs: ['Buổi sáng thức dậy', 'Bé thấy buồn cười:', 'Có ai đang nhảy', 'Một bài vui vui.', 'Đó là tia nắng', 'Nhảy trong lòng tay', 'Nhảy trên bàn học', 'Nhảy trên tán cây.', 'Tối đến giờ ngủ', 'Sực nhớ bé tìm', 'Tìm tia nắng nhỏ:', 'Ngủ rồi. Lặng im...', 'Bé nằm ngẫm nghĩ:', '– Nắng ngủ ở đâu?', '– Nắng ngủ nhà nắng!', 'Mai gặp lại nhau.'],
      exercises: [createSelectionEx('T2-7-1', 'Buổi sáng thức dậy, bé thấy tia nắng ở đâu?', ['Trong lòng tay, trên bàn học, trên tán cây', 'Trên giường ngủ', 'Ngoài sân'], 'Trong lòng tay, trên bàn học, trên tán cây')]
    }
  },
  {
    id: 'T2-7-2',
    title: 'Chủ điểm 7 - Bài 2: Trong giấc mơ buổi sáng',
    pageNumber: 126,
    volume: 2,
    type: 'story',
    content: {
      paragraphs: ['Trong giấc mơ buổi sáng', 'Em gặp ông mặt trời', 'Mang túi đầy hoa nắng', 'Rải hoa vàng khắp nơi', 'Trong giấc mơ buổi sáng', 'Em qua thảo nguyên xanh', 'Có rất nhiều hoa lạ', 'Mang tên bạn lớp mình', 'Trong giấc mơ buổi sáng', 'Em thấy một dòng sông', 'Chảy tràn dòng sữa trắng', 'Đi qua ban mai hồng', 'Trong giấc mơ buổi sáng', 'Em nghe rõ bên tai', 'Lời của chú gà trống:', '– Dậy mau đi! Học bài!...'],
      exercises: [createSelectionEx('T2-7-2', 'Trong giấc mơ, bạn nhỏ thấy ông mặt trời làm gì?', ['Mang túi đầy hoa nắng rải khắp nơi', 'Đang đi ngủ', 'Đang mọc lên từ biển'], 'Mang túi đầy hoa nắng rải khắp nơi')]
    }
  },
  {
    id: 'T2-7-3',
    title: 'Chủ điểm 7 - Bài 3: Ngày mới bắt đầu',
    pageNumber: 128,
    volume: 2,
    type: 'story',
    content: {
      paragraphs: ['Buổi sáng tinh mơ, mặt trời nhô lên đỏ rực. Những tia nắng toả khắp nơi, đánh thức mọi vật.', 'Nắng chiếu vào tổ chim. Chim bay ra khỏi tổ, cất tiếng hót. Nắng chiếu vào tổ ong. Ong bay ra khỏi tổ, đi kiếm mật. Nắng chiếu vào chuồng gà. Đàn gà lục tục ra khỏi chuồng, đi kiếm mồi. Nắng chiếu vào nhà, gọi bé đang nằm ngủ. Bé thức dậy, chuẩn bị đến trường.', 'Một ngày mới bắt đầu.'],
      exercises: [createSelectionEx('T2-7-3', 'Buổi sáng, cái gì đánh thức mọi vật?', ['Những tia nắng', 'Tiếng gà gáy', 'Tiếng chim hót'], 'Những tia nắng')]
    }
  },
  {
    id: 'T2-7-4',
    title: 'Chủ điểm 7 - Bài 4: Hỏi mẹ',
    pageNumber: 132,
    volume: 2,
    type: 'story',
    content: {
      paragraphs: ['Ai quạt thành gió', 'Thổi mây ngang trời?', 'Ai nhuộm mẹ ơi', 'Bầu trời xanh thế?', 'Ông sao thì bé', 'Trăng rằm tròn to.', 'Cuội ngồi gốc đa', 'Phải chăn trâu mãi.', 'Mẹ ơi có phải', 'Cuội buồn lắm không?', 'Nên chú phi công', 'Bay lên thăm Cuội?'],
      exercises: [createSelectionEx('T2-7-4', 'Bạn nhỏ hỏi mẹ những gì?', ['Ai quạt thành gió, ai nhuộm bầu trời xanh, Cuội có buồn không', 'Ai làm ra mưa, ai làm ra nắng', 'Ai trồng cây, ai nuôi chim'], 'Ai quạt thành gió, ai nhuộm bầu trời xanh, Cuội có buồn không')]
    }
  },
  {
    id: 'T2-7-5',
    title: 'Chủ điểm 7 - Bài 5: Những cánh cò',
    pageNumber: 134,
    volume: 2,
    type: 'story',
    content: {
      paragraphs: ['Ông kể ngày xưa, quê của bé có rất nhiều cò. Mùa xuân, từng đàn cò trắng duyên dáng bay tới. Chúng lượn trên bầu trời trong xanh rồi hạ cánh xuống những luỹ tre. Hằng ngày, cò đi mò tôm, bắt cá ở các ao, hồ, đầm.', 'Bây giờ, ao, hồ, đầm phải nhường chỗ cho những toà nhà cao vút, những con đường cao tốc và nhà máy toả khói mịt mù. Cò chẳng còn nơi kiếm ăn. Cò sợ những âm thanh ồn ào. Thế là chúng bay đi.', 'Bé ước ao được thấy những cánh cò trên cánh đồng quê.'],
      exercises: [createSelectionEx('T2-7-5', 'Hằng ngày, cò đi mò tôm, bắt cá ở đâu?', ['Ở các ao, hồ, đầm', 'Ở ngoài biển', 'Ở trên núi'], 'Ở các ao, hồ, đầm')]
    }
  },
  {
    id: 'T2-7-6',
    title: 'Chủ điểm 7 - Bài 6: Buổi trưa hè',
    pageNumber: 138,
    volume: 2,
    type: 'story',
    content: {
      paragraphs: ['Buổi trưa lim dim', 'Nghìn con mắt lá', 'Bóng cũng nằm im', 'Trong vườn êm ả.', 'Bò ơi, bò nghỉ', 'Sau buổi cày mai', 'Có gì ngẫm nghĩ', 'Nhai mãi, nhai hoài...', 'Hoa đại thơm hơn', 'Giữa giờ trưa vắng', 'Con bướm chập chờn', 'Vờn đôi cánh nắng.', 'Bé chưa ngủ được', 'Bé nằm bé nghe', 'Âm thầm rạo rực', 'Cả buổi trưa hè.'],
      exercises: [createSelectionEx('T2-7-6', 'Những con vật nào được nói tới trong bài thơ?', ['Bò, bướm', 'Trâu, chim', 'Gà, lợn'], 'Bò, bướm')]
    }
  },
  {
    id: 'T2-7-7',
    title: 'Chủ điểm 7 - Bài 7: Hoa phượng',
    pageNumber: 140,
    volume: 2,
    type: 'story',
    content: {
      paragraphs: ['Hoa phượng', 'Hôm qua còn lấm tấm', 'Chen lẫn màu lá xanh', 'Sáng nay bừng lửa thẫm', 'Rừng rực cháy trên cành.', '– Bà ơi! Sao mà nhanh!', 'Phượng nở nghìn mắt lửa,', 'Cả dãy phố nhà mình,', 'Một trời hoa phượng đỏ.', 'Hay đêm qua không ngủ', 'Chị gió quạt cho cây?', 'Hay mặt trời ủ lửa', 'Cho hoa bừng hôm nay?'],
      exercises: [createSelectionEx('T2-7-7', 'Những câu thơ nào cho biết hoa phượng nở rất nhiều?', ['Phượng nở nghìn mắt lửa / Một trời hoa phượng đỏ', 'Hôm qua còn lấm tấm / Chen lẫn màu lá xanh', 'Hay đêm qua không ngủ / Chị gió quạt cho cây?'], 'Phượng nở nghìn mắt lửa / Một trời hoa phượng đỏ')]
    }
  },
  {
    id: 'T2-8-1',
    title: 'Chủ điểm 8 - Bài 1: Cậu bé thông minh',
    pageNumber: 144,
    volume: 2,
    type: 'story',
    content: {
      paragraphs: ['Một hôm, cậu bé Vinh đem một quả bưởi ra bãi cỏ làm bóng để cùng chơi với các bạn. Đang chơi, bỗng quả bóng lăn xuống một cái hố gần đó. Cái hố hẹp và rất sâu nên không thể với tay lấy quả bóng lên được. Bọn trẻ nhìn xuống cái hố đầy nuối tiếc.', 'Suy nghĩ một lát, cậu bé Vinh rủ bạn đi mượn mấy chiếc nón, rồi múc nước đổ đầy hố. Các bạn không hiểu Vinh làm thế để làm gì. Lát sau, thấy Vinh cúi xuống cầm quả bóng lên. Các bạn nhìn Vinh trầm trồ thán phục.', 'Cậu bé Vinh ngày ấy chính là Lương Thế Vinh. Về sau, ông trở thành nhà toán học xuất sắc của nước ta.'],
      exercises: [createSelectionEx('T2-8-1', 'Cậu bé Vinh và các bạn chơi trò chơi gì?', ['Đá bóng bằng quả bưởi', 'Trốn tìm', 'Thả diều'], 'Đá bóng bằng quả bưởi')]
    }
  },
  {
    id: 'T2-8-2',
    title: 'Chủ điểm 8 - Bài 2: Lính cứu hoả',
    pageNumber: 148,
    volume: 2,
    type: 'story',
    content: {
      paragraphs: ['Chuông báo cháy vang lên. Những người lính cứu hoả lập tức mặc quần áo chữa cháy, đi ủng, đeo găng, đội mũ rồi lao ra xe. Những chiếc xe cứu hoả màu đỏ chứa đầy nước, bật đèn báo hiệu, rú còi chạy như bay đến nơi có cháy. Tại đây, ngọn lửa mỗi lúc một lớn. Những người lính cứu hoả nhanh chóng dùng vòi phun nước dập tắt đám cháy. Họ dũng cảm quên mình cứu tính mạng và tài sản của người dân.', 'Cứu hoả là một công việc rất nguy hiểm. Nhưng những người lính cứu hoả luôn sẵn sàng có mặt ở mọi nơi có hoả hoạn.'],
      exercises: [createSelectionEx('T2-8-2', 'Trang phục của lính cứu hoả gồm những gì?', ['Quần áo chữa cháy, ủng, găng, mũ', 'Quần áo bình thường', 'Áo phao'], 'Quần áo chữa cháy, ủng, găng, mũ')]
    }
  },
  {
    id: 'T2-8-3',
    title: 'Chủ điểm 8 - Bài 3: Lớn lên bạn làm gì?',
    pageNumber: 152,
    volume: 2,
    type: 'story',
    content: {
      paragraphs: ['Lớn lên bạn làm gì?', 'Tớ muốn làm thuỷ thủ', 'Lái tàu vượt sóng dữ,', 'Băng qua nhiều đại dương.', 'Lớn lên bạn làm gì?', 'Tớ sẽ làm đầu bếp,', 'Làm bánh ngọt thật đẹp,', 'Nấu món mì... siêu ngon.', 'Lớn lên bạn làm gì?', 'À, tớ đi gieo hạt...', 'Mỗi khi vào mùa gặt', 'Lúa vàng reo trên đồng.', 'Lớn lên bạn làm gì?', 'Câu hỏi này... khó quá!', 'Để tớ làm bài đã...', 'Rồi ngày mai, nghĩ dần...'],
      exercises: [createSelectionEx('T2-8-3', 'Bạn nhỏ muốn trở thành thuỷ thủ để làm gì?', ['Lái tàu vượt sóng dữ, băng qua nhiều đại dương', 'Đánh bắt cá', 'Ngắm cảnh biển'], 'Lái tàu vượt sóng dữ, băng qua nhiều đại dương')]
    }
  },
  {
    id: 'T2-8-4',
    title: 'Chủ điểm 8 - Bài 4: Ruộng bậc thang ở Sa Pa',
    pageNumber: 154,
    volume: 2,
    type: 'story',
    content: {
      paragraphs: ['Đến Sa Pa vào mùa lúa chín, khách du lịch có dịp ngắm nhìn vẻ đẹp rực rỡ của những khu ruộng bậc thang. Nhìn xa, chúng giống như những bậc thang khổng lồ. Từng bậc, từng bậc như nối mặt đất với bầu trời. Một màu vàng trải dài bất tận. Đâu đâu cũng ngạt ngào hương lúa.', 'Những khu ruộng bậc thang ở Sa Pa đã có từ hàng trăm năm nay. Chúng được tạo nên bởi đôi bàn tay chăm chỉ, cần mẫn của những người H\'mông, Dao, Hà Nhì,... sống ở đây.'],
      exercises: [createSelectionEx('T2-8-4', 'Vào mùa lúa chín, Sa Pa có gì đặc biệt?', ['Vẻ đẹp rực rỡ của những khu ruộng bậc thang màu vàng', 'Có tuyết rơi', 'Có nhiều hoa đào'], 'Vẻ đẹp rực rỡ của những khu ruộng bậc thang màu vàng')]
    }
  },
  {
    id: 'T2-8-5',
    title: 'Chủ điểm 8 - Bài 5: Nhớ ơn',
    pageNumber: 156,
    volume: 2,
    type: 'story',
    content: {
      paragraphs: ['Ăn một bát cơm,', 'Nhớ người cày ruộng.', 'Ăn đĩa rau muống,', 'Nhớ người đào ao.', 'Ăn một quả đào,', 'Nhớ người vun gốc.', 'Ăn một con ốc,', 'Nhớ người đi mò.', 'Sang đò,', 'Nhớ người chèo chống.', 'Nằm võng,', 'Nhớ người mắc dây.', 'Đứng mát gốc cây,', 'Nhớ người trồng trọt.'],
      exercises: [createSelectionEx('T2-8-5', 'Bài đồng dao nhắc chúng ta cần nhớ ơn những ai?', ['Người cày ruộng, người đào ao, người vun gốc, người đi mò, người chèo chống, người mắc dây, người trồng trọt', 'Chỉ nhớ ơn người trồng cây', 'Chỉ nhớ ơn người nấu ăn'], 'Người cày ruộng, người đào ao, người vun gốc, người đi mò, người chèo chống, người mắc dây, người trồng trọt')]
    }
  },
  {
    id: 'T2-8-6',
    title: 'Chủ điểm 8 - Bài 6: Du lịch biển Việt Nam',
    pageNumber: 158,
    volume: 2,
    type: 'story',
    content: {
      paragraphs: ['Biển nước ta nơi đâu cũng đẹp. Thanh Hoá, Đà Nẵng, Khánh Hoà,... có những bãi biển nổi tiếng, được du khách yêu thích. Nhưng suốt chiều dài đất nước cũng có nhiều bãi biển còn hoang sơ.', 'Đi biển, bạn sẽ được thoả sức bơi lội, nô đùa trên sóng, nhặt vỏ sò, xây lâu đài cát. Nếu đến Mũi Né, bạn sẽ được ngắm nhìn những đồi cát mênh mông. Cát bay làm cho hình dạng các đồi cát luôn thay đổi. Trượt cát ở đây rất thú vị.', 'Biển là món quà kì diệu mà thiên nhiên đã ban tặng cho nước ta.'],
      exercises: [createSelectionEx('T2-8-6', 'Trong bài đọc, những bãi biển nổi tiếng của nước ta có ở đâu?', ['Thanh Hoá, Đà Nẵng, Khánh Hoà', 'Hà Nội, Hải Phòng', 'Cần Thơ, Vũng Tàu'], 'Thanh Hoá, Đà Nẵng, Khánh Hoà')]
    }
  }
];

export const NAV_ITEMS = [
  { id: AppView.HOME, label: 'Trang chủ', icon: <Home size={24} /> },
  { id: AppView.READING, label: 'Tập đọc', icon: <BookOpen size={24} /> },
  { id: AppView.WRITING, label: 'Tập viết', icon: <PenTool size={24} /> },
  { id: AppView.GAMES, label: 'Trò chơi', icon: <Gamepad2 size={24} /> },
  { id: AppView.TEACHER_DASHBOARD, label: 'Giáo viên', icon: <BarChart3 size={24} /> },
  { id: AppView.PARENT_DASHBOARD, label: 'Phụ huynh', icon: <Heart size={24} /> },
];

export const APP_THEMES: AppTheme[] = [
  { primaryColor: '#f97316', secondaryColor: '#fed7aa', backgroundColor: '#FDFCF0', fontFamily: 'Quicksand' },
  { primaryColor: '#2563eb', secondaryColor: '#bfdbfe', backgroundColor: '#eff6ff', fontFamily: 'Quicksand' },
  { primaryColor: '#059669', secondaryColor: '#a7f3d0', backgroundColor: '#f0fdf4', fontFamily: 'Quicksand' },
  { primaryColor: '#7c3aed', secondaryColor: '#ddd6fe', backgroundColor: '#f5f3ff', fontFamily: 'Quicksand' },
];

export const WRITING_EXERCISES: WritingExercise[] = [
  { id: 'w1', category: 'Chữ cái', label: 'a', text: 'a' },
  { id: 'w2', category: 'Chữ cái', label: 'b', text: 'b' },
  { id: 'w3', category: 'Chữ cái', label: 'c', text: 'c' },
  { id: 'w4', category: 'Chữ cái', label: 'd', text: 'd' },
  { id: 'w5', category: 'Chữ cái', label: 'đ', text: 'đ' },
  { id: 'w6', category: 'Chữ cái', label: 'e', text: 'e' },
  { id: 'w7', category: 'Chữ cái', label: 'ê', text: 'ê' },
  { id: 'w8', category: 'Chữ cái', label: 'g', text: 'g' },
  { id: 'w9', category: 'Chữ cái', label: 'h', text: 'h' },
  { id: 'w10', category: 'Chữ cái', label: 'i', text: 'i' },
  { id: 'w11', category: 'Chữ cái', label: 'k', text: 'k' },
  { id: 'w12', category: 'Chữ cái', label: 'l', text: 'l' },
  { id: 'w13', category: 'Chữ cái', label: 'm', text: 'm' },
  { id: 'w14', category: 'Chữ cái', label: 'n', text: 'n' },
  { id: 'w15', category: 'Chữ cái', label: 'o', text: 'o' },
  { id: 'w16', category: 'Chữ cái', label: 'ô', text: 'ô' },
  { id: 'w17', category: 'Chữ cái', label: 'ơ', text: 'ơ' },
  { id: 'w18', category: 'Chữ cái', label: 'p', text: 'p' },
  { id: 'w19', category: 'Chữ cái', label: 'q', text: 'q' },
  { id: 'w20', category: 'Chữ cái', label: 'r', text: 'r' },
  { id: 'w21', category: 'Chữ cái', label: 's', text: 's' },
  { id: 'w22', category: 'Chữ cái', label: 't', text: 't' },
  { id: 'w23', category: 'Chữ cái', label: 'u', text: 'u' },
  { id: 'w24', category: 'Chữ cái', label: 'ư', text: 'ư' },
  { id: 'w25', category: 'Chữ cái', label: 'v', text: 'v' },
  { id: 'w26', category: 'Chữ cái', label: 'x', text: 'x' },
  { id: 'w27', category: 'Chữ cái', label: 'y', text: 'y' },
  { id: 'w28', category: 'Vần', label: 'ai', text: 'ai' },
  { id: 'w29', category: 'Vần', label: 'oi', text: 'oi' },
  { id: 'w30', category: 'Vần', label: 'ui', text: 'ui' },
  { id: 'w31', category: 'Vần', label: 'ưi', text: 'ưi' },
  { id: 'w32', category: 'Vần', label: 'ay', text: 'ay' },
  { id: 'w33', category: 'Vần', label: 'ây', text: 'ây' },
  { id: 'w34', category: 'Từ ngữ', label: 'ba bà', text: 'ba bà' },
  { id: 'w35', category: 'Từ ngữ', label: 'cá cờ', text: 'cá cờ' },
  { id: 'w36', category: 'Từ ngữ', label: 'đi bộ', text: 'đi bộ' },
  { id: 'w37', category: 'Từ ngữ', label: 'bí đỏ', text: 'bí đỏ' },
  { id: 'w38', category: 'Từ ngữ', label: 'đu đủ', text: 'đu đủ' },
  { id: 'w39', category: 'Từ ngữ', label: 'mẹ bé', text: 'mẹ bé' },
  { id: 'w40', category: 'Từ ngữ', label: 'nhà ga', text: 'nhà ga' },
];

