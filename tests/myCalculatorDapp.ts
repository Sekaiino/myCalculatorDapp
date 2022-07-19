import assert from 'assert';
import * as anchor from '@project-serum/anchor';
import { AnchorProvider, web3 } from '@project-serum/anchor';
const {SystemProgram} = anchor.web3;

describe('myCalculatorDapp', () => {
    const provider = AnchorProvider.local();
    anchor.setProvider(provider)

    const calculator = anchor.web3.Keypair.generate()
    const program = anchor.workspace.MyCalculatorDapp
    
    it('Creates a calculator', async() => {
        await program.rpc.create("Welcome to Solana", {
            accounts: {
                calculator: calculator.publicKey,
                user: provider.wallet.publicKey,
                systemProgram: SystemProgram.programId
            },
            signers: [calculator]
        });
        const account = await program.account.calculator.fetch(calculator.publicKey);
        assert.ok(account.greeting === "Welcome to Solana");
    });

    it("Adds two numbers", async() => {
        await program.rpc.add(new anchor.BN(2), new anchor.BN(3), {
            accounts: {
                calculator: calculator.publicKey
            }
        })
        const account = await program.account.calculator.fetch(calculator.publicKey);
        assert.ok(account.result.eq(new anchor.BN(5)));
    });

    it("Substracts two numbers", async() => {
        await program.rpc.sub(new anchor.BN(3), new anchor.BN(3), {
            accounts: {
                calculator: calculator.publicKey
            }
        })
        const account = await program.account.calculator.fetch(calculator.publicKey);
        assert.ok(account.result.eq(new anchor.BN(0)));
    });

    it("Multiply two numbers", async() => {
        await program.rpc.mult(new anchor.BN(3), new anchor.BN(3), {
            accounts: {
                calculator: calculator.publicKey
            }
        })
        const account = await program.account.calculator.fetch(calculator.publicKey);
        assert.ok(account.result.eq(new anchor.BN(9)))
    });

    it("Divide two numbers", async() => {
        await program.rpc.div(new anchor.BN(10), new anchor.BN(3), {
            accounts: {
                calculator: calculator.publicKey
            }
        })
        const account = await program.account.calculator.fetch(calculator.publicKey);
        assert.ok(account.result.eq(new anchor.BN(3)));
        assert.ok(account.remainder.eq(new anchor.BN(1)))
    });
});