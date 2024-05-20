import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { joinGroup } from './store';

function UserPageGet() {
  const navigate = useNavigate();
  const { placeName } = useParams();
  const decodedPlaceName = decodeURIComponent(placeName);
  const [groupData, setGroupData] = useState(null);
  const isJoined = useSelector(state => state.joinStatus);
  const dispatch = useDispatch();

  const handleJoinGroup = async () => {
    if (!groupData) {
      console.error('groupData is undefined');
      return;
    }

    if (groupData.currentParticipants < groupData.maxParticipants) {
      try {
        const response = await fetch(`/api/groups/${groupData._id}/participants`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Failed to join group');
        }
        const updatedGroup = await response.json();
        // 그룹 참여 후 currentParticipants 값 증가
        setGroupData(prevData => ({
          ...prevData,
          currentParticipants: prevData.currentParticipants + 1
        }));
        dispatch(joinGroup()); // 그룹 참여 상태 업데이트
        alert('그룹에 참가 했습니다.');
      } catch (error) {
        console.error('Error joining group:', error);
      }
    } else {
      alert('최대 참가 인원에 도달했습니다.');
    }
  };

  const handleGroup = () => {
    navigate('/web2');
  };

  const handleReview = () => {
    navigate('/web/ReviewPage');
  };

  const handleReviewGet = () => {
    navigate('/web/ReviewGet');
  };

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        console.log('Fetching group data for:', decodedPlaceName); 
        const response = await fetch(`/api/checkgroupdata/${encodeURIComponent(decodedPlaceName)}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched group data:', data); 
        if (!data) {
          throw new Error('No group data found');
        }
        setGroupData(data);
      } catch (error) {
        console.error('Error fetching group data:', error);
      }
    };

    fetchGroupData();
  }, [decodedPlaceName]);

  useEffect(() => {
    console.log('Updated group data:', groupData); // 그룹 데이터가 업데이트될 때마다 로그 추가
  }, [groupData]);

  if (!groupData) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>그룹 정보</h1>
      <p>제목: {groupData.title}</p>
      <p>인원 제한: {groupData.maxParticipants}</p>
      <p>그룹 내용: {groupData.description}</p>
      <p>현재 인원: {groupData.currentParticipants}</p>
      {!isJoined && (
        <>
          <button onClick={handleJoinGroup}>그룹 참여하기</button>
          <button onClick={handleGroup}>다른 그룹 찾으러가기</button>
        </>
      )}
      {isJoined && (
        <>
          <button onClick={handleReview}>리뷰 작성하기</button>
          <button onClick={handleReviewGet}>리뷰 목록 보기</button>
          <button onClick={handleGroup}>다른 그룹 찾으러가기</button>
        </>
      )}
    </div>
  );
}

export default UserPageGet;
