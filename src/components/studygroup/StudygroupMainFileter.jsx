import React, {useState, useRef, useContext} from 'react';
import styled from 'styled-components';
import { Datas } from './StudygroupMain';

function StudygroupMainFilter(props) {
    const filter = props.filter[0];
    const setFilter = props.filter[1];

    const setIsOpened = props.setIsOpened;
    const term = props.term[0];
    const setTerm = props.term[1];
    const loadList = props.loadList;

    const essentialData = useContext(Datas);

    // 필터 항목
    const filterContents = [essentialData.recruitmentType, essentialData.position, essentialData.technologyStack];

    // 탭 타이틀 태그
    const tabRefs = useRef([]);
    // 현재 활성화된 탭 타이틀 태그의 인덱스 번호
    let [nowActiveTabIndex, setNowActiveTabIndex] = useState(0);

    // 현재 화면에 보이는 필터 항목
    let nowDisplayedFilterContents = filterContents[nowActiveTabIndex];

    const clickTab = (e) => {
        // 클릭한 탭
        let clickedTab = e.target;

        // 클릭한 탭이 몇번 인덱스 탭인지 찾음
        let clickedTabIndex = tabRefs.current.findIndex(nthTab => nthTab.isEqualNode(clickedTab));

        // 활성화 되어있는 탭을 클릭했을 때는 탭 컨텐츠가 바뀌지 않고
        // 비활성화 되어있는 탭을 클릭했을 때만 탭 컨텐츠가 바뀜
        //
        // 비활성화 되어있는 탭을 클릭했다면
        if(nowActiveTabIndex !== clickedTabIndex) {
            // 비활성화 되어있는 탭을 활성화 탭으로 변경
            setNowActiveTabIndex(clickedTabIndex);
        }

        nowDisplayedFilterContents = filterContents[clickedTabIndex];
    }

    const clickTabItem = (e) => {
        const tabItem = e.target;
        const filterName = tabItem.textContent;
        const filterIndex = nowDisplayedFilterContents.findIndex(nthFilter => nthFilter.name === filterName);

        const newFilter = {'recruitmentType': filter['recruitmentType'], 'position': [...filter['position']], 'technologyStack': [...filter['technologyStack']]};

        if(nowActiveTabIndex === 0) {
            // 모집 구분의 필터 아이템을 클릭했다면
            if(newFilter['recruitmentType'] === filterIndex) {
                newFilter['recruitmentType'] = null;
            } else {
                newFilter['recruitmentType'] = filterIndex;
            }
        } else if(nowActiveTabIndex === 1) {
            // 모집 분야의 필터 아이템을 선택했다면
            const newPositionFilter = newFilter['position'];

            const index = newPositionFilter.indexOf(filterIndex);
            if(index === -1) {
                newPositionFilter.push(filterIndex);
            } else {
                newPositionFilter.splice(index, 1);
            }

            newFilter['position'] = newPositionFilter;
        } else if(nowActiveTabIndex === 2) {
            // 기술스택의 필터 아이템을 선택했다면
            const newTechnologyStackFilter = newFilter['technologyStack'];

            const index = newTechnologyStackFilter.indexOf(filterIndex);
            if(index === -1) {
                newTechnologyStackFilter.push(filterIndex);
            } else {
                newTechnologyStackFilter.splice(index, 1);
            }

            newFilter['technologyStack'] = newTechnologyStackFilter;
        }

        setFilter(newFilter);
    }

    const isSelected = index => {
        if(nowActiveTabIndex === 0) {
            return filter['recruitmentType'] === index;
        } else if(nowActiveTabIndex === 1) {
            return filter['position'].findIndex(selectedIndex => selectedIndex === index) !== -1;
        } else if(nowActiveTabIndex === 2) {
            return filter['technologyStack'].findIndex(selectedIndex => selectedIndex === index) !== -1;
        }
    }

    function resetFilter() {
        setNowActiveTabIndex(0);
        nowDisplayedFilterContents = filterContents[0];

        setFilter({'position': [], 'technologyStack': [], 'recruitmentType': null});
        setIsOpened(false);
        setTerm("");

        loadList();
    }

    return(
        <div>
            {/* 탭 타이틀 */}
            <TabTitleWrapper className="row">
                <TabTitle active={nowActiveTabIndex === 0}>
                    <span onClick={clickTab} ref={el => tabRefs.current[0] = el}>모집 구분</span>
                </TabTitle>
                <TabTitle active={nowActiveTabIndex === 1}>
                    <span onClick={clickTab} ref={el => tabRefs.current[1] = el}>모집 분야</span>
                </TabTitle>
                <TabTitle active={nowActiveTabIndex === 2}>
                    <span onClick={clickTab} ref={el => tabRefs.current[2] = el}>기술 스택</span>
                </TabTitle>
                <TabTitle className="form-check form-switch form-check-reverse">
                    <input className="form-check-input" type="checkbox" role="switch" id="isOpened" onChange={e => setIsOpened(e.target.checked)}/>
                    <label className="form-check-label" htmlFor="isOpened">모집 중만 보기</label>
                </TabTitle>
                <TermTabTitle>
                    <input className="form-control form-control-lg" type="text" placeholder="검색어" aria-label="검색어" value={term} onChange={e => setTerm(e.target.value)} />
                </TermTabTitle>
                <SearchBtn>
                    <ApplyFilter type="button" className="btn btn-primary" onClick={loadList} style={{"width": "135px"}}>필터 적용</ApplyFilter>
                    <Button type="reset" className="btn btn-secondary" onClick={resetFilter} style={{"width": "135px"}}>필터 초기화</Button>
                </SearchBtn>
            </TabTitleWrapper>
            {/* 탭 컨텐츠 */}
            <TabItemWrapper className="row">
                {
                    nowDisplayedFilterContents != null && nowDisplayedFilterContents.map((filterContent, index) => {
                        return <TabItem key={index} active={isSelected(index)} onClick={clickTabItem}>{filterContent.name}</TabItem>
                    })
                }
            </TabItemWrapper>
        </div>
    );
}

export default StudygroupMainFilter;

const TabTitleWrapper = styled.div`
    border-bottom: 3px solid #cfcfcf;
`

const TabItemWrapper = styled.div`
    margin-top: 10px;
    height: 140px;
`

const publicOptions = styled.div`
    width: auto;
    cursor: pointer;
    text-align: center;
`

const TabTitle = styled(publicOptions)`
    border-bottom: ${props => props.active && "3px solid #002bff"};
    padding-bottom: 20px;
    margin-right: 40px;
    padding-top: 5px;
`

const TermTabTitle = styled(TabTitle)`
    padding-top: 0px;
    margin-right: 0px;
`

const SearchBtn = styled(TabTitle)`
    padding-left: 0;
    padding-right: 0;
    margin-right: 0;
    flex-grow: 1;
    text-align: left;
    padding-top: 2px;
    cursor: default;
`

const TabItem = styled(publicOptions)`
    min-width: 130px;
    height: 60px;
    border: 2px ${props => props.active ? 'solid' : 'dashed'} #cfcfcf;
    border-radius: 30px;
    padding: 10px;
    margin-right: 10px;
    margin-top: 10px;
`

const Button = styled.button`
    width: 135px;
`

const ApplyFilter = styled(Button)`
    margin-right: 10px;
`