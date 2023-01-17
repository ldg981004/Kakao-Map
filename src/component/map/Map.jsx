/* eslint-disable */

/*global kakao*/ 
import './map.css';
import Distance from '../distance/Distance';
import React, {useEffect} from 'react';
import { useState } from 'react';

const {kakao} = window;

function MapTest (props)  {
    const [map,setMap] = useState(null);

    //처음 지도 그리기
    useEffect(()=>{
        //useEffect : 컴포넌트가 렌더링 될 떄 특정 작업을 실행할 수 있도록 하는 Hook
        var markers = [];
        // 마커를 담을 배열
        const container = document.getElementById('map');
        // document.getElementById => 주어진 문자열과 일치하는 id 속성을 가진 요소를 찾고 이를 나타내는 Element 객체를 반환
        // 지도를 표시할 div
        const options = { center: new kakao.maps.LatLng(37.39268742620237, 126.97377807020837),
                          level: 3 };
        // 지도의 option으로 처음 지도가 그려졌을 때 중앙 위치와 확대 레벨(기본3)을 설정

        const kakaoMap = new kakao.maps.Map(container, options);
        // 지도를 표시할 div와 지도 옵션으로 지도를 생성
        setMap(kakaoMap);

        const mapTypeControl = new kakao.maps.MapTypeControl();

        kakaoMap.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
        // 지도 타입을 설정할 수 있는 Control을 상단 우측에 추가

        const zoomControl = new kakao.maps.ZoomControl();
        kakaoMap.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
        // 지도를 확대, 축소 할 수 있는 Control을 우측에 추가

        var infowindow = new kakao.maps.InfoWindow({zIndex:1});

        var ps = new kakao.maps.services.Places();
        // 장소 검색 객체를 생성

        searchPlaces();

        function searchPlaces(){
            var keyword = props.searchPlace;
            ps.keywordSearch( keyword, placeSearchCB); 
        }

        // 키워드로 장소 검색

        function placeSearchCB (data, status, pagination){
            if (status === kakao.maps.services.Status.OK){
                displayPlaces(data);
                displayPagination(pagination);

            }
            else if (status === kakao.maps.services.Status.ZERO_RESULT){
                alert('검색 결과가 존재하지 않습니다.');
                return;
            }
            else if (status === kakao.maps.services.Status.ERROR) {

                alert('검색 결과 중 오류가 발생했습니다.');
                return;
            }
        }

        
        function displayPlaces(places) {

            var listEl = document.getElementById('placesList'), 
            menuEl = document.getElementById('menu_wrap'),
            fragment = document.createDocumentFragment(),
            // 임시 컨테이너로 사용할 비어있는 노드 => 특수 목적 노드
            bounds = new kakao.maps.LatLngBounds();
            // 좌표 정보를 갖고있는 LatLngBounds를 사용해서 
            //좌표들이 모두 보이게 지도의 중심좌표와 레벨을 재설정

            
            // 검색 결과 목록에 추가된 항목들을 제거
            removeAllChildNods(listEl);
        
            // 지도에 표시되고 있는 마커를 제거
            removeMarker();
            
            for ( var i = 0; i < places.length; i++ ) {
        
                // 마커를 생성하고 지도에 표시
                var placePosition = new kakao.maps.LatLng(places[i].y, places[i].x);
                displayMarker(places[i], i);
                    
                var itemEl = getListItem(i, places[i]); 
                // 검색 결과 항목 Element를 생성합니다
        
                // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
                // LatLngBounds 객체에 좌표를 추가합니다
                bounds.extend(placePosition);
      
                fragment.appendChild(itemEl);
                
            }
        
            // 검색결과 항목들을 검색결과 목록 El ement에 추가합니다
            listEl.appendChild(fragment);
            menuEl.scrollTop = 0;
         
            // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
            kakaoMap.setBounds(bounds);
        }
        
        function getListItem(index, places) {

            var el = document.createElement('li'),
            itemStr = '<div classname="marker_' + (index+1) + '"></div>' +
                        '<div classname="info">' +
                        '   <h3>' + places.place_name + '</h5>';
        
            if (places.road_address_name) {
                itemStr += '<span>' + places.road_address_name + '</span>' +
                            '<div classname="jibun">' +  places.address_name  + '</div>';
            } else {
                itemStr += '<span>' +  places.address_name  + '</span>'; 
            }
                         
              itemStr += '<span classname="tel">' + places.phone  + '</span>' +
                        '</div>';           
        
            el.innerHTML = itemStr;
            el.className = 'item';
        
            return el;
        }

        function displayPagination(pagination) {
            var paginationEl = document.getElementById('pagination'),
                fragment = document.createDocumentFragment(),
                i; 
        
            // 기존에 추가된 페이지번호를 삭제
            while (paginationEl.hasChildNodes()) {
                paginationEl.removeChild (paginationEl.lastChild);
                
            }
        
            for (i=1; i<=pagination.last; i++) {
                var el = document.createElement('a');
                el.href = "#";
                el.innerHTML = i;
        
                if (i===pagination.current) {
                    el.className = 'on';
                } else {
                    el.onclick = (function(i) {
                        return function() {
                            pagination.gotoPage(i);
                        }
                    })(i);
                    
                }
        
                fragment.appendChild(el);
                
            }
            removeMarker();
            paginationEl.appendChild(fragment);
        }

        function removeMarker() {
            for ( var i = 0; i < markers.length; i++ ) {
                markers[i].setMap(null);
            }   
            markers = [];
        }

        function removeAllChildNods(el) {   
            while (el.hasChildNodes()) {
                el.removeChild (el.lastChild);
            }
        }
        
        function displayMarker(place, idx){
            var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png';
            var imageSize = new kakao.maps.Size(27,40); // 이미지 크기
            var imgOptions = {
                spriteSize : new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
                spriteOrigin : new kakao.maps.Point(0,  (idx*46)+10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
                offset: new kakao.maps.Point(13, 37)
            };

            var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions);
             
            var marker = new kakao.maps.Marker({
                image: markerImage,
                map: kakaoMap,
                position: new kakao.maps.LatLng(place.y, place.x)
            });

            kakao.maps.event.addListener(marker, 'mouseover', function(){
                infowindow.setContent('<div style="padding:5px; color:black; width:100%; font-size:11x;">' + place.place_name + '</div>');
                infowindow.open(kakaoMap, marker);
                markers.push(marker);
            });

            kakao.maps.event.addListener(marker,'mouseout', function() {
                infowindow.close();
            });
        }
        
    },[props.searchPlace]);
    //[] => 최초 렌더링 시에만 나옴
    // searchPlace => 할 때 렌더링

    return (
        <div className='board'>
            <div id="map" className='mapboard'></div>
            <div id='menu_wrap' className='menu'>
                
                    <ul id="category">
                        <li id="BK9" data-order="0"> 
                            <span class="category_bg bank"></span>
                            은행
                        </li>       
                        <li id="MT1" data-order="1"> 
                            <span class="category_bg mart"></span>
                            마트
                        </li>  
                        <li id="PM9" data-order="2"> 
                            <span class="category_bg pharmacy"></span>
                            약국
                        </li>  
                        <li id="OL7" data-order="3"> 
                            <span class="category_bg oil"></span>
                            주유소
                        </li>  
                        <li id="CE7" data-order="4"> 
                            <span class="category_bg cafe"></span>
                            카페
                        </li>  
                        <li id="CS2" data-order="5"> 
                            <span class="category_bg store"></span>
                            편의점
                        </li>      
                    </ul>
               
                <hr></hr>
                <div className='start'>
                <Distance/>
                </div>
                <hr></hr>
                <ul id='placesList' className='place'></ul>
                <div id="pagination" className='pag'></div>
            </div>       
        </div>
            
        
    );
};

export default MapTest;