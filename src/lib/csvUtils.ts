// src/lib/csvUtils.ts

/**
 * 주어진 데이터 배열을 CSV 파일로 다운로드하는 함수
 * @param data 다운로드할 데이터 배열 (객체의 배열)
 * @param filename 파일 이름 (확장자 제외)
 */
// 🔽 Record<string, any>[] 타입을 Record<string, string | number>[]로 수정
export const downloadAsCSV = (data: Record<string, string | number>[], filename: string) => {
  if (!data || data.length === 0) {
    alert("다운로드할 데이터가 없습니다.");
    return;
  }

  // 첫 번째 객체의 키를 사용하여 CSV 헤더를 생성
  const headers = Object.keys(data[0]);

  // 객체 배열을 CSV 문자열로 변환
  const csvContent = [
    headers.join(','), // 헤더 행
    ...data.map(row =>
      headers.map(header => {
        let cell = row[header as keyof typeof row]; // 🔽 타입 추론을 위해 인덱싱 방식 수정
        // 셀 값에 쉼표가 포함된 경우 큰따옴표로 감싸기
        if (typeof cell === 'string' && cell.includes(',')) {
          cell = `"${cell}"`;
        }
        return cell;
      }).join(',')
    )
  ].join('\n');

  // Blob 객체를 생성하고 다운로드 링크를 만들어 클릭 이벤트를 실행
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};