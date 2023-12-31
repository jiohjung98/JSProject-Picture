import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getDatabase, ref as dbRef, push } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js"; 
import { updateDoc } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDbIZHxlYJfqnLaXxXUpAUsPY_k6C3CvJY",
  authDomain: "js-project-b9579.firebaseapp.com",
  projectId: "js-project-b9579",
  storageBucket: "js-project-b9579.appspot.com",
  messagingSenderId: "364495315069",
  appId: "1:364495315069:web:85a6cb78f642b054d35114",
  measurementId: "G-QNNZXRNBFJ"
};

// Firebase SDK 초기화
const app = initializeApp(firebaseConfig);

const registerDogButton = document.getElementById("registerDogButton");
const modalContainer = document.getElementById("addDogDialog");
const closeModalButton = document.getElementById("closeModalButton");
const dialogRegisterDogButton = document.getElementById("dialogRegisterDogButton");

// 파일 입력 요소와 미리보기를 위한 이미지 요소 가져오기
const dogImageInput = document.getElementById("dogImageInput");
const imagePreview = document.getElementById("imagePreview");
const imagePreviewText = document.getElementById("imagePreviewText");

const dogNameInput = document.getElementById("dogNameInput");

const checkbox = document.createElement("input");
checkbox.type = "checkbox";
checkbox.className = "dog-checkbox";

// 체크박스 상태를 저장할 변수
let checkboxStatus = localStorage.getItem("checkboxStatus") === "checked";

// 체크박스 상태를 변수에 설정
checkbox.checked = checkboxStatus;

// 체크박스 클릭 이벤트 핸들러
checkbox.addEventListener("click", () => {
  checkboxStatus = checkbox.checked;
  localStorage.setItem("checkboxStatus", checkboxStatus ? "checked" : "unchecked");
});


registerDogButton.addEventListener("click", () => {
    modalContainer.style.display = "block"; 
    imagePreview.src = "#";
});

closeModalButton.addEventListener("click", () => {
    // 이미지 미리보기 초기화 & '이미지 선택' 텍스트 보이게 
    imagePreview.src = "#";
    imagePreviewText.style.display = "block";
    modalContainer.style.display = "none"; 
});


window.addEventListener("click", (event) => {
    if (event.target === modalContainer) {
        modalContainer.style.display = "none";
    }
});

window.addEventListener("load", () => {
  const dogInfoContainer = document.getElementById("dogInfoContainer");
  const db = getFirestore(app);
  const dogsCollection = collection(db, "dogs");

  getDocs(dogsCollection).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const dogData = doc.data();
      dogData.id = doc.id; // Firestore 문서의 ID 값을 dogData 객체에 추가
      const dogInfo = createDogInfoElement(dogData);
      dogInfoContainer.appendChild(dogInfo);
    });
  }).catch((error) => {
    console.error("Firestore 데이터 가져오기 실패:", error);
  });
});

// 파일 선택 시 이미지 미리보기
const imagePreviewLabel = document.querySelector(".image-preview-circle span");

// 파일 선택 시 이미지 미리보기
dogImageInput.addEventListener("change", (event) => {
  const selectedImage = event.target.files[0];

  if (selectedImage) {
    const reader = new FileReader();

    reader.onload = (e) => {
      imagePreview.src = e.target.result;
      imagePreview.style.display = "block";
      imagePreviewLabel.style.display = "none"; 
    };

    reader.readAsDataURL(selectedImage);
  }
});

// 이미지 미리보기 클릭 시 파일 선택 input 열기
imagePreviewLabel.addEventListener("click", () => {
  dogImageInput.click();
});


// // 이미지 로딩 상태를 감지하고 처리하는 함수
// function handleImageLoad(image, callback) {
//   if (image.complete) {
//     callback();
//   } else {
//     image.addEventListener('load', callback);
//   }
// }

// // 이미지 로딩 후에 정보 엘리먼트를 추가하는 함수
// function addDogInfoAfterImageLoad(dogData) {
//   const dogInfoContainer = document.getElementById("dogInfoContainer");
//   const dogInfo = createDogInfoElement(dogData);
//   dogInfoContainer.appendChild(dogInfo);
// }

// // 이미지 로딩 후에 정보 엘리먼트 추가 처리
// function handleImageLoadAndAdd(dogData) {
//   const dogImage = document.createElement("img");
//   dogImage.src = dogData.imageUrl; // 이미지 URL을 가져와서 설정
//   dogImage.alt = "강아지 사진";
//   dogImage.style.borderRadius = "50%";

//   // 이미지 로딩 완료를 감지하고 정보 엘리먼트를 추가
//   handleImageLoad(dogImage, () => {
//     const imageContainer = document.createElement("div");
//     imageContainer.className = "image-container";
//     imageContainer.style.width = "calc(20% - 30px)";

//     // 이미지 클릭 시 수정 다이얼로그 열기
//     imageContainer.addEventListener("click", () => {
//       openEditDialog(dogData); // 수정 다이얼로그 열기
//     });

//     imageContainer.appendChild(dogImage);
//     addDogInfoAfterImageLoad(dogData);
//   });
// }

dialogRegisterDogButton.addEventListener("click", () => {

  // 기존에 생성한 엘리먼트가 없으면 새로 생성
  if (!dogDataMap.has(dogData.id)) {
    const dogInfo = createDogInfoElement(dogData);
    dogInfoContainer.appendChild(dogInfo);
  }

  //  정보 생성
  const dogInfo = document.createElement("div");
  dogInfo.className = "dog-info";

  //  체크박스 생성
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "dog-checkbox";

  //  정보 컨테이너 생성
  const infoContainer = document.createElement("div");
  infoContainer.className = "info-container";

  // 이미지 컨테이너 생성
  const imageContainer = document.createElement("div");
  imageContainer.className = "image-container";
  imageContainer.style.width = "calc(20% - 30px)";

  //  정보 내용 생성
  const dogImage = document.createElement("img");
  dogImage.src = imagePreview.src;
  dogImage.alt = "강아지 사진";
  dogImage.style.borderRadius = "50%";
  
  const dogName = document.createElement("span");
  dogName.textContent = dogNameInput.value;

  const dogBreedInput = document.getElementById("dogBreedInput");

  const dogBreed = document.createElement("span");
  dogBreed.textContent = dogBreedInput.value;

  const dogBirthdayInput = document.getElementById("dogBirthdayInput");
  const dogBirthday = document.createElement("span");
  dogBirthday.textContent = dogBirthdayInput.value;

  const dogGenderInput = document.getElementById("dogGenderInput");
  const dogGender = document.createElement("span");
  dogGender.textContent = dogGenderInput.value;

  // 생성한 엘리먼트들을 이미지 컨테이너와 정보 컨테이너에 추가
  imageContainer.appendChild(dogImage);
  infoContainer.appendChild(checkbox);
  infoContainer.appendChild(imageContainer);
  infoContainer.appendChild(dogName);
  infoContainer.appendChild(dogBreed);
  infoContainer.appendChild(dogBirthday);
  infoContainer.appendChild(dogGender);

  //  정보 컨테이너를 강아지 정보 엘리먼트에 추가
  dogInfo.appendChild(infoContainer);

  //  정보 엘리먼트를 dogInfoContainer에 추가
  const dogInfoContainer = document.getElementById("dogInfoContainer");
  dogInfoContainer.appendChild(dogInfo);


  const selectedImage = dogImageInput.files[0];

  if (!selectedImage) {
    console.error("이미지가 선택되지 않았습니다.");
    return; // 이미지가 선택되지 않은 경우 함수 종료
  }


   // Firebase의 Cloud Storage에 이미지 업로드
   const storage = getStorage(app); // Firebase Storage 객체 가져오기
   const storageRef = ref(storage, `dog_images/${dogImageInput.files[0].name}`);
   const uploadTask = uploadBytes(storageRef, dogImageInput.files[0]);
 
   console.log(storageRef);

   //  정보 등록 후에 Firestore 데이터 다시 가져와서 표시
  const db = getFirestore(app);
  const dogsCollection = collection(db, "dogs");

  getDocs(dogsCollection).then((querySnapshot) => {
    const dogInfoContainer = document.getElementById("dogInfoContainer");
    dogInfoContainer.innerHTML = ""; // 기존의  정보 엘리먼트 모두 삭제

    querySnapshot.forEach((doc) => {
      const dogData = doc.data();
      dogData.id = doc.id; // Firestore 문서의 ID 값을 dogData 객체에 추가
      const dogInfo = createDogInfoElement(dogData);
      dogInfoContainer.appendChild(dogInfo);
    });
  }).catch((error) => {
    console.error("Firestore 데이터 가져오기 실패:", error);
  });
 
   let imageUrl; // imageUrl 변수를 블록 밖에서 선언

   // 이미지 업로드가 완료된 후, 이미지 URL을 가져오기 위한 작업 수행
   uploadTask
    .then((snapshot) => {
      return getDownloadURL(snapshot.ref).then((url) => {
        imageUrl = url; // 이미지 URL을 가져와서 설정
        const db = getFirestore(app);
        return addDoc(collection(db, "dogs"), {
          name: dogNameInput.value,
          breed: dogBreedInput.value,
          birthday: dogBirthdayInput.value,
          gender: dogGenderInput.value,
          imageUrl: imageUrl,
          isChecked: checkbox.checked
        }).then((docRef) => {
          dogCheckboxes.push({ checkbox, dogData: {
            name: dogNameInput.value,
            breed: dogBreedInput.value,
            birthday: dogBirthdayInput.value,
            gender: dogGenderInput.value,
            imageUrl: imageUrl,
            isChecked: checkbox.checked,
            id: docRef.id
          }});
        });
      });
    })
     .then(() => {
       // 데이터 추가가 완료된 경우
       console.log("강아지 정보가 성공적으로 등록되었습니다.");
 
       // 입력한 정보 초기화
       dogNameInput.value = "";
       dogBreedInput.value = "";
       dogBirthdayInput.value = "";
       dogGenderInput.value = "male";
       imagePreview.src = "#";
       imagePreviewText.style.display = "block";
       modalContainer.style.display = "none";
     })
     .catch((error) => {
       console.error("강아지 정보 등록에 실패했습니다:", error);
     });

    // 체크박스와 데이터를 연결하여 추적
    dogCheckboxes.push({ checkbox, dogData: {
      name: dogNameInput.value,
      breed: dogBreedInput.value,
      birthday: dogBirthdayInput.value,
      gender: dogGenderInput.value,
      imageUrl: imageUrl,
      isChecked: checkbox.checked
    }});
 
  // 다이얼로그 숨기기
  modalContainer.style.display = "none";
});

// 객체와 엘리먼트 관리를 위한 맵
const dogDataMap = new Map();

// 체크박스 변화 감지와 정보 추적
const dogCheckboxes = []; // 선택된 체크박스를 추적하기 위한 배열

// 정보 엘리먼트 생성
function createDogInfoElement(dogData) {

  // 이미 생성한 엘리먼트가 있는 경우 해당 엘리먼트를 반환
  if (dogDataMap.has(dogData.id)) {
    return dogDataMap.get(dogData.id);
  }

  const dogInfo = document.createElement("div");
  dogInfo.className = "dog-info";

  const imageContainer = document.createElement("div");
  imageContainer.className = "image-container";
  imageContainer.style.width = "calc(20% - 30px)";

  // // 이미지 클릭 시 수정 다이얼로그 열기
  imageContainer.addEventListener("click", () => {
    openEditDialog(dogData); // 수정 다이얼로그 열기
    
  });

  // imageContainer.addEventListener("click", async (event) => {
  //   const clickedElement = event.target;
  //   const dogId = clickedElement.id;
  //   console.log("클릭한 개의 Document ID:", dogId);
  
  //   // Firestore에서 개의 정보 가져오기
  //   const db = getFirestore(app);
  //   const dogRef = doc(db, "dogs", dogId); // 문서 참조 생성
  
  //   try {
  //     const dogSnapshot = await getDoc(dogRef);
  //     if (dogSnapshot.exists()) {
  //       const dogData = dogSnapshot.data();
  //       dogData.id = dogSnapshot.id; // Document ID 추가
  //       openEditDialog(dogData); // 수정 다이얼로그 열기
  //     } else {
  //       console.log("개의 정보가 존재하지 않습니다.");
  //     }
  //   } catch (error) {
  //     console.error("개의 정보를 가져오는 중에 오류가 발생했습니다:", error);
  //   }
  // });
  
  

  // dogInfo.addEventListener("click", () => {
  //   openEditDialog(dogData); // 수정 다이얼로그 열기
  // });


   // 체크박스 생성 및 추가
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "dog-checkbox";
  if (dogData.isChecked) {
    checkbox.checked = true;
  }
  dogInfo.appendChild(checkbox);
  checkbox.addEventListener("change", () => {
    dogData.isChecked = checkbox.checked;
  });
  dogInfo.appendChild(checkbox);
  dogCheckboxes.push({ checkbox, dogData });

  // // 이미지 컨테이너 생성
  // const imageContainer = document.createElement("div");
  // imageContainer.className = "image-container";
  // imageContainer.style.width = "calc(20% - 30px)";
  dogInfo.appendChild(imageContainer);

  // 이미지
  const dogImage = document.createElement("img");
  dogImage.src = dogData.imageUrl; // 이미지 URL을 가져와서 설정
  dogImage.alt = "강아지 사진";
  dogImage.style.borderRadius = "50%";
  imageContainer.appendChild(dogImage);
  dogInfo.appendChild(imageContainer);

  // 이름
  const dogName = document.createElement("span");
  dogName.textContent = dogData.name;
  dogInfo.appendChild(dogName);

  // 나이
  const dogBreed = document.createElement("span");
  dogBreed.textContent = dogData.breed;
  dogInfo.appendChild(dogBreed);

  // 생년월일
  const dogBirthday = document.createElement("span");
  dogBirthday.textContent = dogData.birthday;
  dogInfo.appendChild(dogBirthday);

  // 성별
  const dogGender = document.createElement("span");
  dogGender.textContent = dogData.gender;
  dogInfo.appendChild(dogGender);

  // 새로운 엘리먼트를 맵에 추가
  dogDataMap.set(dogData.id, dogInfo);
  return dogInfo;
}

// 선택된 정보 삭제 처리
const deleteButton = document.querySelector(".delete-btn");

deleteButton.addEventListener("click", () => {
  const dogsToDelete = dogCheckboxes.filter(item => item.checkbox.checked);

  // 정보 엘리먼트와 파이어베이스 데이터베이스에서 삭제
  const deletePromises = dogsToDelete.map(({ checkbox, dogData }) => {
    // 화면에서 삭제
    const dogInfoContainer = document.getElementById("dogInfoContainer");
    const dogInfoElement = checkbox.parentNode;
    dogInfoContainer.removeChild(dogInfoElement);

    // dogCheckboxes 배열에서 삭제
    const index = dogCheckboxes.findIndex(item => item.checkbox === checkbox);
    if (index !== -1) {
      dogCheckboxes.splice(index, 1);
    }

    // 파이어베이스 데이터베이스에서 삭제
    const db = getFirestore(app);
    if (dogData && dogData.id) {
      console.log("Deleting document with ID:", dogData.id); // 추가된 로그
      const dogRef = doc(db, "dogs", dogData.id);
      return deleteDoc(dogRef)  // 반환된 프로미스를 반환
        .then(() => {
          // 로컬 스토리지에서도 삭제
          const storedDogInfo = JSON.parse(localStorage.getItem("dogInfo")) || [];
          const updatedDogInfo = storedDogInfo.filter(info => info.id !== dogData.id);
          localStorage.setItem("dogInfo", JSON.stringify(updatedDogInfo));
        })
        .catch((error) => {
          console.error("강아지 정보 삭제에 실패했습니다:", error);
        })
        .finally(() => {
          // 삭제 후에 화면 업데이트
          updateDogInfoOnScreen();
        });
    }
  });

  // 삭제 작업이 모두 완료된 후에 로컬 스토리지와 화면을 업데이트
  Promise.all(deletePromises).then(() => {
    console.log("삭제 작업이 완료되어 화면을 업데이트합니다.");
    updateDogInfoOnScreen();
  });
});


// 수정 다이얼로그 열기 함수
function openEditDialog(dogData) {
  // 수정 가능한 입력 요소들에 기존 데이터를 설정
  dialogNameInput.value = dogData.name;
  dialogBreedInput.value = dogData.breed;
  dialogBirthdayInput.value = dogData.birthday;
  dialogGenderInput.value = dogData.gender;

  // 다이얼로그 열기
  editDialog.style.display = "block";

  // "저장" 버튼 클릭 이벤트 핸들러 등록하기 전에 이전의 핸들러를 제거
  dialogEditDogButton.removeEventListener("click", saveEditAndClose);

  // "저장" 버튼 클릭 이벤트 핸들러 등록
  dialogEditDogButton.addEventListener("click", () => {
    saveEditAndClose(dogData); // 선택한 객체의 정보를 전달
  });
}

// "저장" 버튼 클릭 시 업데이트 처리 및 다이얼로그 닫기
function saveEditAndClose(dogData) {
  // 업데이트할 정보 설정
  const updatedInfo = {
    name: dialogNameInput.value,
    breed: dialogBreedInput.value,
    birthday: dialogBirthdayInput.value,
    gender: dialogGenderInput.value
    // 나머지 필요한 정보 추가
  };

  // 개별 객체의 정보를 업데이트
  dogData.name = updatedInfo.name;
  dogData.breed = updatedInfo.breed;
  dogData.birthday = updatedInfo.birthday;
  dogData.gender = updatedInfo.gender;

  // 객체 정보 업데이트
  updateDogDataInFirestore(dogData)
    .then(() => {
      console.log("정보 업데이트 완료");
      // 화면 업데이트
      updateDogInfoOnScreen();
    })
    .catch((error) => {
      console.error("정보 업데이트 실패:", error);
    });

  // 다이얼로그 닫기
  editDialog.style.display = "none";
}

// ... 이하 동일한 부분은 그대로 유지합니다 ...


// 정보 업데이트 함수
function updateDogDataInFirestore(dogData) {
  const db = getFirestore(app);
  const dogRef = doc(db, "dogs", dogData.id);

  // 업데이트할 정보 설정
  const updatedData = {
    name: dogData.name,
    breed: dogData.breed,
    birthday: dogData.birthday,
    gender: dogData.gender,
    // 나머지 필요한 정보 추가
  };

  // Firestore 문서 업데이트
  return updateDoc(dogRef, updatedData); // 반환된 프로미스를 반환
}

// ... 이하 동일한 부분은 그대로 유지합니다 ...


// 객체 정보 엘리먼트 업데이트
function updateDogInfoElement(dogData) {
  const dogInfoElement = document.getElementById(dogData.id);
  if (dogInfoElement) {
    dogInfoElement.innerHTML = createDogInfoElement(dogData).innerHTML;
  }
}

const closeEditDialogButton = document.getElementById("closeEditDialogButton");
closeEditDialogButton.addEventListener("click", () => {
  editDialog.style.display = "none";
});

const closeBtn = document.getElementById('dialogNoEditDogButton')
closeBtn.addEventListener("click", () => {
  editDialog.style.display = 'none';
});


// 서치바 엘리먼트 선택
const searchInput = document.querySelector(".main-header-middle-search input");

// 정보 업데이트 및 화면 업데이트
function updateDogInfoOnScreen() {
  const dogInfoContainer = document.getElementById("dogInfoContainer");
  const db = getFirestore(app);
  const dogsCollection = collection(db, "dogs");

  getDocs(dogsCollection)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const dogData = doc.data();
        dogData.id = doc.id;

        // 이미 생성한 엘리먼트가 있는 경우 해당 엘리먼트를 활용하여 업데이트
        if (dogDataMap.has(dogData.id)) {
          const dogInfo = dogDataMap.get(dogData.id);
          // 엘리먼트의 내용을 수정
          // 예: dogInfo.querySelector(".dog-name").textContent = dogData.name;
        } else {
          // 기존 코드와 동일하게 엘리먼트 생성
          const dogInfo = createDogInfoElement(dogData);
          dogInfoContainer.appendChild(dogInfo);
        }
      });
    })
    .catch((error) => {
      console.error("Firestore 데이터 가져오기 실패:", error);
    });
}







