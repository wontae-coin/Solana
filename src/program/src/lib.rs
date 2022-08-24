use solana_program::{
    entrypoint,
    msg,
    pubkey::Pubkey,
    account_info::{next_account_info, AccountInfo},
};

entrypoint!(process_instruction);
// 무적권 있어야하는것

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    // client의 keys가 들어갑니다
    instruction_data: &[u8]
    // buffer로 데이터
) -> entrypoint::ProgramResult {
    msg!("hello world");

    Ok(())
}

// 솔라나는 빌트인컨트랙트(=시스템컨트랙트)를 불러와야지만 트랜스퍼를 할 수 있음
// 이더리움은 컨트랙트(솔리디티)에서 내가 커스터마이징하게 쓸 수 있다
