<template>
	<v-container class="fill-height" fluid>
		<v-row class="fill-height">
			<v-col cols="12" md="7" class="d-flex ma-0 pa-0 fill-screen">
				<v-row
					align="center"
					justify="center"
					style="z-index: 2;"
					class="transparent"
				>
					<v-col cols="12" sm="6" md="7">
						<v-card flat class="transparent">
							<v-toolbar flat>
								<v-toolbar-title class="display-1 font-weight-bold">
									회원가입
								</v-toolbar-title>
							</v-toolbar>
							<v-card-text>
								<validation-observer ref="observer" v-slot="{ invalid }">
									<validation-provider
										v-slot="{ errors }"
										name="Name"
										:rules="{ required: true }"
									>
										<v-text-field
											filled
											rounded
											dense
											v-model="name"
											:error-messages="errors"
											label="이름"
											required
										></v-text-field>
									</validation-provider>
									<validation-provider
										v-slot="{ errors }"
										name="Id"
										:rules="{
											required: true,
											max: 30,
											min: 5,
										}"
									>
										<v-text-field
											filled
											rounded
											dense
											v-model="id"
											:counter="30"
											:error-messages="errors"
											label="아이디"
											required
										></v-text-field>
									</validation-provider>

									<validation-provider
										v-slot="{ errors }"
										name="password"
										ref="password"
										:rules="{
											required: true,
											min: 8,
											max: 30,
										}"
									>
										<v-text-field
											filled
											rounded
											dense
											v-model="password"
											type="password"
											:counter="30"
											:error-messages="errors"
											label="비밀번호"
											required
										></v-text-field>
									</validation-provider>

									<validation-provider
										v-slot="{ errors }"
										name="password confirm"
										:rules="{
											required: true,
											min: 8,
											max: 30,
											confirmed: 'password',
										}"
									>
										<v-text-field
											filled
											rounded
											dense
											v-model="confirmation"
											type="password"
											:counter="30"
											:error-messages="errors"
											label="비밀번호 확인"
											required
										></v-text-field>
									</validation-provider>
									<v-spacer></v-spacer>
									<div class="ma-3 mx-3" align="right">
										<v-btn
											rounded
											color="#426dad"
											@click="register"
											:disabled="invalid"
											class="subtitle-1 white--text font-weight-bold"
										>
											회원가입
										</v-btn>
									</div>
								</validation-observer>
							</v-card-text>
						</v-card>
					</v-col>
				</v-row>
				<div class="bg"></div>
			</v-col>
			<v-col cols="5" md="5" class="ma-0 pa-0 fill-height">
				<v-card class="d-flex align-end" color="#426dad" tile minHeight="100%">
					<span class="pa-2 white--text title font-weight-bold"
						>CCMS | Cloud Contents Management System</span
					>
				</v-card>
			</v-col>
		</v-row>
		<v-snackbar v-model="snackbar.show" :timeout="2000" :color="snackbar.color">
			{{ snackbar.text }}
			<v-btn text @click="snackbar.show = false">
				닫기
			</v-btn>
		</v-snackbar>
	</v-container>
</template>
<script>
import { required, max, min, confirmed } from 'vee-validate/dist/rules';
import {
	extend,
	ValidationObserver,
	ValidationProvider,
	setInteractionMode,
} from 'vee-validate';

setInteractionMode('eager');

extend('required', {
	...required,
	message: '내용을 입력해 주세요',
});

extend('max', {
	...max,
	message: '{length}자 보다 길수 없습니다.',
});
extend('min', {
	...min,
	message: '{length}자 보다 길어야 합니다.',
});
extend('confirmed', {
	...confirmed,
	message: '비밀번호가 일치하지 않습니다.',
});

export default {
	components: {
		ValidationProvider,
		ValidationObserver,
	},
	data: () => ({
		name: '',
		id: '',
		password: '',
		confirmation: '',
		snackbar: {
			show: false,
			text: '',
			color: '',
		},
	}),

	methods: {
		submit() {
			this.$refs.observer.validate();
		},
		async register() {
			try {
				const result = await this.$axiosAuth.post('/user', {
					id: this.id,
					password: this.password,
					name: this.name,
				});
				if (result.status == 201) {
					this.snackbar.color = 'success';
					this.snackbar.text = '회원가입 성공';
					this.snackbar.show = true;
				}
				this.$router.push('/login');
			} catch (err) {
				this.snackbar.color = 'error';
				this.snackbar.text = '이미 사용중인 아이디 입니다.';
				this.snackbar.show = true;
			}
		},
	},
};
</script>
<style>
.bg {
	background-image: url('../../assets/auth_background.png');
	position: fixed;
	bottom: 0px;
	left: 0px;
	width: 35%;
	height: 35%;
	background-size: contain;
	z-index: 1;
}
</style>
