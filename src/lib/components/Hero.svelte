<script>
	import { HeadImage } from '$lib';
</script>

<div
	class="h-auto grid-cols-2 items-center gap-10 overflow-x-hidden bg-cover bg-top p-10 md:py-14 lg:grid lg:py-24 xl:py-14"
	data-aos="fade-right"
	data-aos-duration="800"
>
	<div class="overflow-hidden rounded-lg sm:pb-0 md:p-10 lg:p-0">
		<img
			id="heroImg1"
			class="rounded-lg transition-all duration-300 ease-in-out hover:scale-105 sm:mx-auto sm:w-4/6 sm:pb-12 lg:w-full lg:pb-0"
			src={HeadImage}
			alt="Awesome hero page"
			width="500"
			height="488"
		/>
	</div>
	<div class="bg-white py-14 pr-2 md:mb-14 md:py-0">
		<h1 class="text-3xl font-semibold text-blue-900 lg:text-3xl xl:text-5xl">
			<span class="block w-full">Get a financial experience</span> for growing your business!
		</h1>
		<p class="py-4 text-lg text-gray-500 md:py-6 2xl:py-8 2xl:pr-5">
			Empowering you to make better financial decisions, We truly are professional money planners...
		</p>
		<div class="mt-4">
			<a
				href="#contact"
				class="group rounded-lg bg-blue-500 px-5 py-3 text-lg tracking-wider text-white hover:bg-blue-600 md:px-8"
				><span>Explore More</span>
			</a>
		</div>
	</div>
</div>
